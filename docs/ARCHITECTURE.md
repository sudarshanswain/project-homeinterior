# Home Interior Platform — Phase 1 Architecture

> **Status:** Phase 2 — Project Scaffold ✅  
> **Next step:** Phase 3 — Public UI

---

## 1. Executive Summary

A production-grade interior design platform modeled after DesignCafe, Livspace, and HomeLane. The system serves four audiences:

| Audience | Primary goals |
|----------|---------------|
| **Public visitors** | Discover services, browse portfolio, read blog, submit leads |
| **Customers** | Track projects, appointments, quotes, invoices |
| **Staff** (Sales, Designer) | Manage assigned leads and projects |
| **Admin** | Full CMS, analytics, user management |

**Architectural stance:** Modular monolith — one deployable unit, clean internal boundaries, extractable later if scale demands it.

---

## 2. Technology Decisions

### 2.1 Backend: Next.js Route Handlers (not Express)

| Option | Verdict |
|--------|---------|
| **Next.js App Router API Routes** | ✅ **Selected** |
| Node.js + Express (separate service) | ❌ Deferred |

**Why Next.js API Routes wins for this project:**

1. **Single codebase** — One repo, one Docker image, one deployment pipeline. Lower operational burden for a team strong in DevOps but newer to application code.
2. **Shared TypeScript types** — DTOs, enums, and Prisma types flow from database → API → UI without duplication.
3. **Colocated rendering + API** — Public pages (SSR/SSG), admin panel, and REST endpoints share auth, validation, and services.
4. **SEO co-location** — Blog, portfolio, and landing pages live beside the APIs that power them; no cross-origin complexity on the public site.
5. **Sufficient scale** — An interior-design business platform is I/O-bound (DB, file storage, email). Next.js route handlers handle this comfortably before a split is justified.
6. **Future escape hatch** — Service layer lives in `src/lib/services/`, not in route files. If traffic grows, extract services to Express/Fastify without rewriting business logic.

**When Express would make sense:** Multiple mobile apps, third-party API marketplace, or independent scaling of API vs. frontend. Not needed for v1.

---

### 2.2 Frontend: Next.js 15 App Router

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Router | App Router | Server Components, streaming, built-in layouts, metadata API for SEO |
| Rendering | Hybrid SSG + SSR + ISR | Home/portfolio/blog = SSG/ISR; dashboards = SSR (auth); forms = client |
| Styling | Tailwind CSS v4 | Utility-first, small bundle, design-token friendly |
| Animation | Framer Motion | Smooth, GPU-friendly; lazy-loaded on client components only |
| Forms | React Hook Form + Zod | Performance, schema reuse on client and server |
| UI primitives | shadcn/ui (Radix) | Accessible, unstyled base; matches luxury/minimal aesthetic; speeds admin panel |

**PageSpeed strategy (>95):**
- `next/image` with WebP/AVIF, explicit dimensions, priority on LCP hero
- Font subsetting via `next/font`
- Route-level code splitting (default in App Router)
- Server Components for static sections (hero stats, FAQ, footer)
- Dynamic imports for Framer Motion, maps, before/after slider
- ISR for portfolio/blog (revalidate on CMS publish)

---

### 2.3 Database: PostgreSQL 16 + Prisma 6

- **PostgreSQL** — ACID, JSON columns for flexible metadata, full-text search for admin search, mature AWS RDS support.
- **Prisma** — Type-safe queries, migrations, seed scripts, excellent Next.js integration.
- **Connection pooling** — PgBouncer in Docker Compose production profile; Prisma `directUrl` for migrations.

---

### 2.4 Authentication: JWT + RBAC

```
┌─────────────┐     POST /api/auth/login      ┌──────────────┐
│   Client    │ ─────────────────────────────►│  Auth Service│
└─────────────┘                               └──────┬───────┘
       ▲                                             │
       │  Access Token (Bearer, 15 min)              │ bcrypt verify
       │  Refresh Token (httpOnly cookie, 7 days)   ▼
       └────────────────────────────────────  PostgreSQL (users)
```

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access JWT | Memory / sessionStorage | 15 min | API authorization header |
| Refresh JWT | httpOnly, Secure, SameSite=Strict cookie | 7 days | Silent re-auth |

**RBAC roles (enum):** `ADMIN` | `SALES` | `DESIGNER` | `CUSTOMER`

**Authorization layers:**
1. Next.js Middleware — route-level gate (`/admin/*`, `/dashboard/*`)
2. API middleware — JWT verify + role check per endpoint
3. Service layer — resource ownership (customer sees only their projects)

**Password:** bcrypt (cost factor 12).

**Phone verification (ready):** `phone_verified_at` column + pluggable provider interface (Twilio/MSG91 stub in v1).

---

### 2.5 File Storage: Adapter Pattern

```
StorageProvider (interface)
├── LocalStorageProvider   ← default (./uploads mapped in Docker volume)
└── S3StorageProvider      ← enabled via STORAGE_DRIVER=s3
```

Migration to S3 = change env vars, zero code changes in upload handlers.

---

### 2.6 Email & Notifications

- **Nodemailer** with SMTP (dev: Mailpit in Docker Compose)
- Event-driven internal notifications table + optional real-time later
- Templates: lead received, appointment confirmed, quote ready, admin alert

---

### 2.7 Security Stack

| Concern | Implementation |
|---------|----------------|
| Input validation | Zod on every API boundary |
| SQL injection | Prisma parameterized queries |
| XSS | React auto-escape + CSP headers via Next.js config |
| CSRF | SameSite cookies + CSRF token for cookie-auth mutations |
| Rate limiting | `@upstash/ratelimit` with Redis **or** in-memory fallback via env |
| HTTP headers | Next.js `headers()` config (Helmet-equivalent) |
| CORS | Restricted to `NEXT_PUBLIC_APP_URL` in production |
| Audit logs | `audit_logs` table — who, what, when, IP, user-agent |
| Secrets | Environment variables only; never committed |

---

### 2.8 Deployment Topology

```
                    ┌─────────────┐
   Internet ───────►│    Nginx    │  TLS termination, gzip, static cache
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
       ┌──────▼──────┐           ┌──────▼──────┐
       │  Next.js    │           │  PostgreSQL │
       │  (Node 22)  │◄─────────►│     16      │
       └──────┬──────┘           └─────────────┘
              │
       ┌──────▼──────┐
       │   uploads/  │  (volume → future S3)
       └─────────────┘
```

**Health check:** `GET /api/health` — DB ping + disk writable.

**Future AWS path:** Same Docker image → ECR → ECS Fargate or EKS; RDS PostgreSQL; S3 for uploads; ALB replaces Nginx or sits in front.

---

## 3. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                              │
│  app/(public)/*   app/(auth)/*   app/(dashboard)/customer/*             │
│  app/(dashboard)/admin/*   components/ui   components/features          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│                         API LAYER (thin controllers)                    │
│  app/api/auth/*   app/api/leads/*   app/api/admin/*   app/api/health    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│                         SERVICE LAYER (business logic)                  │
│  lib/services/auth   leads   portfolio   blog   appointments   ...      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│                         DATA LAYER                                      │
│  lib/repositories/*  ──►  Prisma Client  ──►  PostgreSQL                │
└─────────────────────────────────────────────────────────────────────────┘

Cross-cutting: lib/auth  lib/validators  lib/storage  lib/email  lib/logger
```

**SOLID application:**
- **S** — One service per domain (LeadService, PortfolioService)
- **O** — StorageProvider interface for local/S3 swap
- **L** — Repository interfaces swappable for testing
- **I** — Narrow API response types per feature
- **D** — Services depend on repository interfaces, not Prisma directly in routes

---

## 4. Folder Structure

```
HomeInterior/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # lint, typecheck, test, build
│       └── deploy.yml             # Docker build + push (stub)
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   └── postgres/
│       └── init.sql               # extensions (uuid-ossp, pg_trgm)
├── docs/
│   ├── ARCHITECTURE.md            # this file
│   ├── API.md                     # Phase 4
│   └── DEPLOYMENT.md              # Phase N
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── images/                    # static marketing assets
│   ├── robots.txt                 # generated or static
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (public)/              # marketing site — no auth required
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # home
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── portfolio/
│   │   │   │   └── [slug]/
│   │   │   ├── gallery/
│   │   │   ├── blog/
│   │   │   │   └── [slug]/
│   │   │   ├── pricing/
│   │   │   ├── contact/
│   │   │   └── book-consultation/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/
│   │   │   ├── customer/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx       # customer dashboard
│   │   │   │   ├── designs/
│   │   │   │   ├── appointments/
│   │   │   │   ├── quotations/
│   │   │   │   └── projects/
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx       # admin dashboard
│   │   │       ├── portfolio/
│   │   │       ├── blog/
│   │   │       ├── leads/
│   │   │       ├── appointments/
│   │   │       ├── customers/
│   │   │       ├── designers/
│   │   │       ├── testimonials/
│   │   │       ├── faq/
│   │   │       ├── pricing/
│   │   │       └── analytics/
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── leads/route.ts
│   │   │   ├── appointments/route.ts
│   │   │   ├── contact/route.ts
│   │   │   ├── newsletter/route.ts
│   │   │   ├── portfolio/
│   │   │   ├── blog/
│   │   │   └── admin/
│   │   │       └── [...]/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── layout.tsx             # root layout (theme, fonts)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn primitives (Button, Input, ...)
│   │   ├── layout/                # Header, Footer, Sidebar, MobileNav
│   │   ├── features/              # domain components
│   │   │   ├── home/
│   │   │   ├── portfolio/
│   │   │   ├── blog/
│   │   │   ├── leads/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   └── providers/             # ThemeProvider, AuthProvider
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-media-query.ts
│   │   └── use-debounce.ts
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── rbac.ts
│   │   │   └── session.ts
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   ├── lead.repository.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── lead.service.ts
│   │   │   └── ...
│   │   ├── storage/
│   │   │   ├── index.ts
│   │   │   ├── local.provider.ts
│   │   │   └── s3.provider.ts
│   │   ├── email/
│   │   │   ├── transporter.ts
│   │   │   └── templates/
│   │   ├── validators/
│   │   │   ├── auth.schema.ts
│   │   │   ├── lead.schema.ts
│   │   │   └── ...
│   │   ├── seo/
│   │   │   ├── metadata.ts
│   │   │   └── json-ld.ts
│   │   ├── logger.ts
│   │   ├── prisma.ts
│   │   ├── api-response.ts        # standardized API envelope
│   │   ├── rate-limit.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── config/
│   │   ├── site.ts                  # company name, contact, social links
│   │   ├── navigation.ts
│   │   └── env.ts                   # typed env validation (Zod)
│   └── middleware.ts                # auth + role routing
├── uploads/                         # local storage (gitignored)
├── .env.example
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
└── README.md
```

---

## 5. Database Schema (Normalized Overview)

### Core entities

```
users
├── id, email, phone, password_hash, role (enum)
├── first_name, last_name, avatar_url
├── phone_verified_at, email_verified_at
├── is_active, last_login_at
└── created_at, updated_at

refresh_tokens
├── id, user_id, token_hash, expires_at, revoked_at

audit_logs
├── id, user_id, action, entity, entity_id, metadata (json), ip, user_agent
```

### CMS & public content

```
categories          — room types (Kitchen, Bedroom, …), hierarchical optional
portfolio_projects  — title, slug, description, category_id, featured, status
portfolio_images    — project_id, url, alt, sort_order, is_before/after pair
gallery_images      — standalone gallery entries
blog_posts          — title, slug, content (html/json), excerpt, featured_image
blog_categories, blog_tags, blog_post_tags (M:N)
testimonials        — name, rating, content, photo, is_featured
faqs                — question, answer, category, sort_order
pricing_packages    — name, slug, price_range, features (json), is_popular
```

### Lead generation

```
leads               — name, email, phone, source, status, assigned_to (sales)
lead_notes          — lead_id, user_id, note
newsletter_subscribers — email, subscribed_at, unsubscribed_at
contact_messages    — name, email, subject, message, status
```

### Customer & operations

```
appointments        — customer_id, designer_id, datetime, type, status, notes
quotations          — customer_id, lead_id, amount, status, valid_until, pdf_url
invoices            — quotation_id, invoice_number, amount, pdf_url, status
projects            — customer_id, designer_id, title, status, progress (0-100)
project_milestones  — project_id, title, status, due_date, completed_at
saved_designs       — user_id, portfolio_project_id
favourite_designs   — user_id, portfolio_project_id (or separate if different semantics)
```

### Indexes & constraints

- Unique: `users.email`, `blog_posts.slug`, `portfolio_projects.slug`
- Index: `leads.status`, `appointments.datetime`, `audit_logs.created_at`
- Full-text (pg_trgm): admin search on leads, customers, blog titles

---

## 6. API Design Conventions

**Base path:** `/api/v1/` (versioned from day one)

**Response envelope:**
```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "total": 100 }
}
```

**Error envelope:**
```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] }
}
```

**Pagination:** cursor-based for infinite scroll (gallery); offset for admin tables.

**Admin routes:** `/api/v1/admin/*` — require `ADMIN` or scoped role.

---

## 7. SEO Architecture

| Feature | Implementation |
|---------|----------------|
| Meta tags | Next.js `generateMetadata()` per route |
| Open Graph / Twitter | `metadata.openGraph`, `metadata.twitter` |
| Schema.org | JSON-LD components in `lib/seo/json-ld.ts` |
| Sitemap | Dynamic `app/sitemap.ts` from DB slugs |
| Robots | `app/robots.ts` — disallow `/admin`, `/api` |
| Canonical | `alternates.canonical` in metadata |
| Blog SEO | slug URLs, structured Article schema, related posts |

---

## 8. Theme & Design System

**Aesthetic:** Modern luxury — generous whitespace, serif + sans pairing, muted gold/bronze accent on neutral base.

| Token | Light | Dark |
|-------|-------|------|
| Background | `#FAFAF8` | `#0F0F0F` |
| Foreground | `#1A1A1A` | `#F5F5F0` |
| Accent | `#B8860B` (dark gold) | `#D4AF37` |
| Muted | `#6B7280` | `#9CA3AF` |

- CSS variables in `globals.css`, toggled via `next-themes`
- System preference default, manual override persisted
- Framer Motion: `prefers-reduced-motion` respected

---

## 9. Dependency List (Phase 2 install)

### Production

| Package | Purpose |
|---------|---------|
| `next` | Framework (App Router, SSR, API) |
| `react`, `react-dom` | UI |
| `typescript` | Type safety |
| `@prisma/client` | ORM client |
| `prisma` | CLI, migrations (dev) |
| `zod` | Validation (API + forms) |
| `react-hook-form` | Forms |
| `@hookform/resolvers` | Zod ↔ RHF bridge |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT sign/verify |
| `jose` | Edge-compatible JWT in middleware |
| `nodemailer` | Email |
| `framer-motion` | Animations |
| `next-themes` | Dark/light mode |
| `clsx`, `tailwind-merge` | Class utilities |
| `class-variance-authority` | Component variants (shadcn) |
| `@radix-ui/react-*` | Accessible primitives (via shadcn) |
| `lucide-react` | Icons |
| `date-fns` | Date formatting |
| `sharp` | Image processing (Next.js) |
| `slugify` | URL slugs |
| `@tiptap/react`, `@tiptap/starter-kit` | Rich text editor (admin blog) |
| `react-compare-image` or custom | Before/after slider |
| `pino`, `pino-pretty` | Structured logging |

### Development

| Package | Purpose |
|---------|---------|
| `eslint`, `eslint-config-next` | Linting |
| `@types/*` | Type definitions |
| `tsx` | Run seed scripts |
| `prettier`, `prettier-plugin-tailwindcss` | Formatting |
| `tailwindcss`, `@tailwindcss/postcss` | Styling |
| `@testing-library/react`, `vitest` | Unit/integration tests |
| `playwright` | E2E (Phase N) |

### Optional (production hardening)

| Package | Purpose |
|---------|---------|
| `@upstash/ratelimit`, `@upstash/redis` | Distributed rate limiting |
| `@aws-sdk/client-s3` | S3 storage adapter |
| `@aws-sdk/s3-request-presigner` | Presigned upload URLs |

---

## 10. Environment Variables

```bash
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/homeinterior
DIRECT_URL=postgresql://user:pass@postgres:5432/homeinterior

# Auth
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Storage
STORAGE_DRIVER=local          # local | s3
UPLOAD_DIR=./uploads
AWS_S3_BUCKET=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=

# Rate limiting
RATE_LIMIT_ENABLED=true
REDIS_URL=                    # optional

# Maps / WhatsApp (public)
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=

# Phone verification (future)
SMS_PROVIDER=                 # twilio | msg91
```

All validated at startup via `src/config/env.ts` (Zod) — app fails fast on misconfiguration.

---

## 11. Phased Delivery Roadmap

| Phase | Scope | Exit criteria |
|-------|-------|---------------|
| **1** ✅ | Architecture, decisions, structure | This document approved |
| **2** | Project scaffold, Docker, Prisma schema, health check | `docker compose up` + `/api/health` 200 |
| **3** | Public UI — home, layout, theme, core sections | Lighthouse >90 on static home |
| **4** | Backend — auth, leads, contact, newsletter APIs | Postman/tests pass |
| **5** | Admin panel — CMS CRUD | Admin can manage portfolio/blog |
| **6** | Customer dashboard | Customer login + saved designs |
| **7** | Blog, SEO, sitemap | Rich results validate |
| **8** | Security hardening, rate limits, audit logs | Security checklist pass |
| **9** | CI/CD, production Docker, Nginx, docs | One-command deploy |

Each phase compiles and runs before the next begins.

---

## 12. Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep | Strict phase gates; MVP admin CMS first |
| PageSpeed with animations | Lazy-load Framer Motion; static Server Components for hero |
| JWT in localStorage XSS | Short access token; refresh in httpOnly cookie |
| Local storage in multi-instance deploy | Switch to S3 before horizontal scaling |
| Admin rich text XSS | Sanitize HTML server-side (DOMPurify/isomorphic-dompurify) |

---

## 13. Decision Log

| # | Decision | Alternatives considered | Date |
|---|----------|------------------------|------|
| D1 | Next.js monolith over Express | Separate Express API | Phase 1 |
| D2 | Prisma over Drizzle | Drizzle lighter but less mature ecosystem | Phase 1 |
| D3 | shadcn/ui for admin + forms | Headless UI only, MUI | Phase 1 |
| D4 | TipTap for blog editor | Quill, Slate | Phase 1 |
| D5 | JWT not session cookies for API | NextAuth — heavier, less control for RBAC | Phase 1 |
| D6 | Feature folders under `components/features` | Atomic design only | Phase 1 |

---

**Awaiting your approval to proceed to Phase 2: Project scaffold.**

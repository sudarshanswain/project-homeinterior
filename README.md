# Home Interior Platform

Production-ready interior design platform built with Next.js, PostgreSQL, and Docker.

## Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend:** Next.js API Route Handlers
- **Database:** PostgreSQL 16, Prisma ORM
- **Auth:** JWT + RBAC (Admin, Sales, Designer, Customer)
- **Deployment:** Docker, Docker Compose, Nginx

## Quick Start (Docker)

```bash
# Copy environment file
cp .env.example .env

# Start PostgreSQL and Mailpit
docker compose up -d postgres mailpit

# Run migrations and seed (first time)
docker compose --profile migrate run --rm migrate

# Build and start the app
docker compose up -d --build app

# Health check
curl http://localhost:3000/api/health
```

## Local Development

Requires Node.js 22+ and PostgreSQL 16.

```bash
npm ci
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed Accounts

| Role     | Email                        | Password        |
|----------|------------------------------|-----------------|
| Admin    | admin@homeinterior.local     | Admin@123456    |
| Sales    | sales@homeinterior.local     | Sales@123456    |
| Designer | designer@homeinterior.local  | Designer@123456 |
| Customer | customer@homeinterior.local  | Customer@123456 |

## Scripts

| Command              | Description                |
|----------------------|----------------------------|
| `npm run dev`        | Start dev server           |
| `npm run build`      | Production build           |
| `npm run start`      | Start production server    |
| `npm run lint`       | ESLint                     |
| `npm run typecheck`  | TypeScript check           |
| `npm run db:migrate` | Create/run migrations      |
| `npm run db:seed`    | Seed sample data           |

## Production (with Nginx)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile prod up -d --build
```

## Documentation

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architecture details.

## Project Phases

- [x] Phase 1 — Architecture
- [x] Phase 2 — Project scaffold
- [ ] Phase 3 — Public UI
- [ ] Phase 4 — Backend APIs
- [ ] Phase 5 — Admin panel
- [ ] Phase 6 — Customer dashboard
- [ ] Phase 7 — Blog & SEO
- [ ] Phase 8 — Security hardening
- [ ] Phase 9 — CI/CD & production deploy

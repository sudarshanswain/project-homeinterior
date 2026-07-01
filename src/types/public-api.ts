import { ContentStatus, LeadSource } from "@prisma/client";

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  companyName: string;
  tagline: string;
  description: string;
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  phone: string;
  email: string;
  whatsapp: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postalCode: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  twitter: string | null;
  pinterest: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  facebookPixelId: string | null;
  copyrightText: string | null;
  defaultLanguage: string;
  timezone: string;
  currency: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  badge: string | null;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  backgroundImage: string | null;
  overlayOpacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  icon: string | null;
  image: string | null;
  features: string[];
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Process Steps ────────────────────────────────────────────────────────────

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  stepNumber: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Features (Why Choose Us) ─────────────────────────────────────────────────

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string;
  category: Category;
  location: string | null;
  area: string | null;
  budget: string | null;
  duration: string | null;
  isFeatured: boolean;
  status: ContentStatus;
  publishedAt: string | null;
  images: PortfolioImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isBefore: boolean;
  pairId: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  content: string;
  photoUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Pricing Packages ─────────────────────────────────────────────────────────

export interface PricingPackage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceFrom: number;
  priceTo: number | null;
  features: string[];
  isPopular: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: BlogCategory | null;
  authorName: string;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

// ─── Contact & Lead Forms ─────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface LeadFormData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  city?: string;
  propertyType?: string;
  budget?: string;
  message?: string;
  source: LeadSource;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export interface SocialLinks {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  pinterest: string | null;
  youtube: string | null;
  twitter: string | null;
}
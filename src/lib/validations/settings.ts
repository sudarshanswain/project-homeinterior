import { z } from "zod";

export const siteSettingsSchema = z.object({
  // Company Information
  companyName: z.string().min(1, "Company name is required").max(100),
  tagline: z.string().max(200).optional().default(""),
  description: z.string().max(1000).optional().default(""),
  logo: z.string().url().optional().nullable(),
  favicon: z.string().url().optional().nullable(),

  // Contact Information
  phone: z.string().min(1, "Phone number is required").max(20),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().max(20).optional().default(""),

  // Address
  addressLine1: z.string().max(200).optional().default(""),
  addressLine2: z.string().max(200).optional().default(""),
  city: z.string().max(100).optional().default(""),
  state: z.string().max(100).optional().default(""),
  country: z.string().max(100).default("India"),
  postalCode: z.string().max(20).optional().default(""),

  // Social Media
  facebook: z.string().url().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  youtube: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  pinterest: z.string().url().optional().nullable(),

  // Branding
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").default("#0f172a"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").default("#1e293b"),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").default("#f59e0b"),

  // SEO
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  metaKeywords: z.string().max(200).optional().nullable(),

  // Analytics
  googleAnalyticsId: z.string().optional().nullable(),
  googleTagManagerId: z.string().optional().nullable(),
  facebookPixelId: z.string().optional().nullable(),

  // System
  copyrightText: z.string().max(200).optional().nullable(),
  defaultLanguage: z.string().max(10).default("en"),
  timezone: z.string().max(50).default("Asia/Kolkata"),
  currency: z.string().max(10).default("INR"),
  maintenanceMode: z.boolean().default(false),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const updateSiteSettingsSchema = siteSettingsSchema.partial().required({
  companyName: true,
  email: true,
  phone: true,
});

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
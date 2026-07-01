import { z } from "zod";

// ─── Customer Information ────────────────────────────────────────────────────

export const customerInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().min(10, "Valid phone number is required").max(15),
  whatsapp: z.string().max(15).default(""),
  email: z.string().email("Invalid email address"),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  preferredTime: z.string().max(50).default(""),
});

export type CustomerInfoInput = z.infer<typeof customerInfoSchema>;

// ─── Property Details ────────────────────────────────────────────────────────

export const propertyDetailsSchema = z.object({
  propertyType: z.enum([
    "APARTMENT",
    "VILLA",
    "INDEPENDENT_HOUSE",
    "COMMERCIAL",
    "OFFICE",
    "RETAIL",
    "RESTAURANT",
    "HOTEL",
  ]),
  configuration: z.string().max(50).default(""),
  totalArea: z.number().min(100, "Minimum area is 100 sq ft"),
  status: z.enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION", "RENOVATION"]),
  expectedPossession: z.string().default(""),
});

export type PropertyDetailsInput = z.infer<typeof propertyDetailsSchema>;

// ─── Room Configuration ──────────────────────────────────────────────────────

export const roomSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  length: z.number().min(0).optional().default(0),
  width: z.number().min(0).optional().default(0),
  height: z.number().min(0).optional().default(0),
  area: z.number().min(0).optional().default(0),
  dimensionMode: z.enum(["LENGTH_WIDTH", "TOTAL_AREA"]).default("LENGTH_WIDTH"),
  wardrobeNeeded: z.boolean().default(false),
  falseCeiling: z.boolean().default(false),
  tvUnit: z.boolean().default(false),
  wallpaper: z.boolean().default(false),
  lighting: z.boolean().default(false),
  painting: z.boolean().default(false),
  flooring: z.boolean().default(false),
  lightingType: z.enum(["BASIC", "PREMIUM", "LUXURY"]).default("BASIC"),
  flooringType: z.enum(["TILES", "WOOD", "MARBLE", "VINYL"]).default("TILES"),
  furnitureRequired: z.boolean().default(false),
  additionalNotes: z.string().max(500).optional().default(""),
  remarks: z.string().max(500).optional().default(""),
});

export type RoomInput = z.infer<typeof roomSchema>;

export const roomsSchema = z.object({
  rooms: z.array(roomSchema).min(1, "At least one room is required"),
});

export type RoomsInput = z.infer<typeof roomsSchema>;

// ─── Services Required ───────────────────────────────────────────────────────

export const servicesSchema = z.object({
  services: z.array(z.string()).min(1, "Select at least one service"),
});

export type ServicesInput = z.infer<typeof servicesSchema>;

// ─── Design Preference ───────────────────────────────────────────────────────

export const designPreferenceSchema = z.object({
  designStyle: z.enum([
    "LUXURY",
    "MODERN",
    "MINIMALIST",
    "SCANDINAVIAN",
    "TRADITIONAL",
    "INDUSTRIAL",
    "CONTEMPORARY",
  ]),
  inspirationUrls: z.array(z.string().url()).max(10).optional().default([]),
});

export type DesignPreferenceInput = z.infer<typeof designPreferenceSchema>;

// ─── Budget ──────────────────────────────────────────────────────────────────

export const budgetSchema = z.object({
  budgetRange: z.enum([
    "UNDER_5_LAKHS",
    "5_10_LAKHS",
    "10_20_LAKHS",
    "20_40_LAKHS",
    "40_LAKHS_PLUS",
    "CUSTOM",
  ]),
  budgetCustom: z.number().min(0).optional().default(0),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

// ─── File Upload ─────────────────────────────────────────────────────────────

export const fileUploadSchema = z.object({
  files: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string().url(),
        fileType: z.string().optional(),
        fileSize: z.number().optional(),
        category: z.enum([
          "floor_plan",
          "cad",
          "room_image",
          "video",
          "reference",
        ]),
      })
    )
    .max(20, "Maximum 20 files allowed")
    .optional()
    .default([]),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// ─── Complete Lead Submission ────────────────────────────────────────────────

export const leadSubmissionSchema = z.object({
  customer: customerInfoSchema,
  property: propertyDetailsSchema,
  rooms: roomsSchema,
  services: servicesSchema,
  design: designPreferenceSchema,
  budget: budgetSchema,
  attachments: fileUploadSchema,
  notes: z.string().max(1000).optional().default(""),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

// ─── Budget Range Mapping ────────────────────────────────────────────────────

export const BUDGET_RANGES: Record<string, { min: number; max: number | null }> = {
  UNDER_5_LAKHS: { min: 0, max: 500000 },
  "5_10_LAKHS": { min: 500000, max: 1000000 },
  "10_20_LAKHS": { min: 1000000, max: 2000000 },
  "20_40_LAKHS": { min: 2000000, max: 4000000 },
  "40_LAKHS_PLUS": { min: 4000000, max: null },
  CUSTOM: { min: 0, max: null },
};

// ─── Default Rooms Based on Configuration ────────────────────────────────────

export const DEFAULT_ROOMS_BY_CONFIG: Record<string, string[]> = {
  "1 BHK": [
    "Master Bedroom",
    "Living Room",
    "Kitchen",
    "Bathroom",
    "Balcony",
  ],
  "2 BHK": [
    "Master Bedroom",
    "Bedroom 2",
    "Living Room",
    "Dining",
    "Kitchen",
    "Bathroom 1",
    "Bathroom 2",
    "Balcony",
  ],
  "3 BHK": [
    "Master Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Living Room",
    "Dining Room",
    "Kitchen",
    "Utility Area",
    "Balcony",
    "Bathroom 1",
    "Bathroom 2",
    "Bathroom 3",
    "Pooja Room",
    "Study Room",
  ],
  "4 BHK": [
    "Master Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Bedroom 4",
    "Living Room",
    "Dining",
    "Kitchen",
    "Utility",
    "Balcony",
    "Bathroom 1",
    "Bathroom 2",
    "Bathroom 3",
    "Bathroom 4",
    "Pooja",
    "Study",
    "Store Room",
  ],
  "5 BHK": [
    "Master Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Bedroom 4",
    "Bedroom 5",
    "Living Room",
    "Dining",
    "Kitchen",
    "Utility",
    "Balcony",
    "Bathroom 1",
    "Bathroom 2",
    "Bathroom 3",
    "Bathroom 4",
    "Pooja",
    "Study",
  ],
  Villa: [],
  Custom: ["Living Room", "Kitchen"],
};

// ─── Available Room Types for Custom Rooms ───────────────────────────────────

export const CUSTOM_ROOM_TYPES = [
  "Home Theatre",
  "Gym",
  "Office",
  "Kids Room",
  "Library",
  "Bar",
  "Prayer Room",
  "Guest Room",
  "Store Room",
  "Dressing Room",
  "Master Bedroom",
  "Bedroom",
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Bathroom",
  "Balcony",
  "Utility",
  "Pooja Room",
  "Study",
];

// ─── Lighting & Flooring Options ─────────────────────────────────────────────

export const LIGHTING_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "PREMIUM", label: "Premium" },
  { value: "LUXURY", label: "Luxury" },
];

export const FLOORING_OPTIONS = [
  { value: "TILES", label: "Tiles" },
  { value: "WOOD", label: "Wood" },
  { value: "MARBLE", label: "Marble" },
  { value: "VINYL", label: "Vinyl" },
];

// ─── Available Services ──────────────────────────────────────────────────────

export const AVAILABLE_SERVICES = [
  "Modular Kitchen",
  "Wardrobes",
  "TV Unit",
  "False Ceiling",
  "Painting",
  "Lighting",
  "Furniture",
  "Electrical",
  "Plumbing",
  "Civil Work",
  "Wallpaper",
  "Curtains",
  "Smart Home",
  "Others",
];

// ─── Design Styles ───────────────────────────────────────────────────────────

export const DESIGN_STYLES = [
  { value: "LUXURY", label: "Luxury" },
  { value: "MODERN", label: "Modern" },
  { value: "MINIMALIST", label: "Minimalist" },
  { value: "SCANDINAVIAN", label: "Scandinavian" },
  { value: "TRADITIONAL", label: "Traditional" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "CONTEMPORARY", label: "Contemporary" },
];

// ─── Property Types ──────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "OFFICE", label: "Office" },
  { value: "RETAIL", label: "Retail" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "HOTEL", label: "Hotel" },
];

// ─── Property Status ─────────────────────────────────────────────────────────

export const PROPERTY_STATUSES = [
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "RENOVATION", label: "Renovation" },
];

// ─── Budget Ranges for Display ───────────────────────────────────────────────

export const BUDGET_RANGE_OPTIONS = [
  { value: "UNDER_5_LAKHS", label: "Under 5 Lakhs" },
  { value: "5_10_LAKHS", label: "5 – 10 Lakhs" },
  { value: "10_20_LAKHS", label: "10 – 20 Lakhs" },
  { value: "20_40_LAKHS", label: "20 – 40 Lakhs" },
  { value: "40_LAKHS_PLUS", label: "40 Lakhs+" },
  { value: "CUSTOM", label: "Custom Budget" },
];

// ─── Status Options for Admin ────────────────────────────────────────────────

export const LEAD_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

export const LEAD_SOURCES = [
  { value: "WEBSITE", label: "Website" },
  { value: "CONSULTATION", label: "Consultation" },
  { value: "QUOTE_REQUEST", label: "Quote Request" },
  { value: "CONTACT_FORM", label: "Contact Form" },
  { value: "REFERRAL", label: "Referral" },
  { value: "OTHER", label: "Other" },
];
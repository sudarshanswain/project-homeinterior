// ─── Lead Types ──────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city?: string;
  state?: string;
  preferredTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  customerId: string;
  leadId?: string;
  propertyType: PropertyType;
  configuration?: string;
  totalArea: number;
  status: PropertyStatus;
  expectedPossession?: string;
  createdAt: string;
  updatedAt: string;
  rooms: Room[];
}

export type PropertyType =
  | "APARTMENT"
  | "VILLA"
  | "INDEPENDENT_HOUSE"
  | "COMMERCIAL"
  | "OFFICE"
  | "RETAIL"
  | "RESTAURANT"
  | "HOTEL";

export type PropertyStatus = "READY_TO_MOVE" | "UNDER_CONSTRUCTION" | "RENOVATION";

export interface Room {
  id: string;
  propertyId: string;
  roomName: string;
  length?: number;
  width?: number;
  height?: number;
  area?: number;
  dimensionMode?: string;
  wardrobeNeeded: boolean;
  falseCeiling: boolean;
  lighting: boolean;
  painting: boolean;
  flooring: boolean;
  tvUnit: boolean;
  wallpaper: boolean;
  lightingType: string;
  flooringType: string;
  furnitureRequired: boolean;
  additionalNotes?: string;
  remarks?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  leadId: string;
  services: string[];
  designStyle?: string;
  inspirationUrls: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetCustom?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadAttachment {
  id: string;
  leadId: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  category?: string;
  sortOrder: number;
  createdAt: string;
}

export interface VendorAssignment {
  id: string;
  leadId: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  status: VendorAssignStatus;
  assignedAt: string;
  assignedById: string;
  quotations: VendorQuotation[];
}

export type VendorAssignStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export interface VendorQuotation {
  id: string;
  vendorAssignmentId: string;
  estimatedCost: number;
  timeline?: string;
  remarks?: string;
  quotationPdf?: string;
  status: QuotationStatus;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  userId: string;
  note: string;
  createdAt: string;
}

export interface LeadStatusHistory {
  id: string;
  leadId: string;
  userId?: string;
  fromStatus?: LeadStatus;
  toStatus: LeadStatus;
  notes?: string;
  createdAt: string;
}

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
export type LeadSource = "WEBSITE" | "CONSULTATION" | "QUOTE_REQUEST" | "CONTACT_FORM" | "REFERRAL" | "OTHER";

export interface Lead {
  id: string;
  leadNumber: string;
  customerId: string;
  source: LeadSource;
  status: LeadStatus;
  priority: string;
  estimatedValue?: number;
  assignedToId?: string;
  notes?: string;
  followUpDate?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  property?: Property;
  requirements?: Requirement;
  attachments: LeadAttachment[];
  vendorAssignments: VendorAssignment[];
  statusHistory: LeadStatusHistory[];
}

export interface LeadWithDetails extends Lead {
  customer: Customer;
  property?: Property;
  requirements?: Requirement;
  attachments: LeadAttachment[];
  vendorAssignments: VendorAssignment[];
  statusHistory: LeadStatusHistory[];
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface LeadListResponse {
  success: boolean;
  data: Lead[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeadDetailResponse {
  success: boolean;
  data: LeadWithDetails;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    leadId: string;
    leadNumber: string;
  };
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  assignedToId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "leadNumber";
  sortOrder?: "asc" | "desc";
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface LeadDashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  totalValue: number;
  avgValue: number;
  leadsThisMonth: number;
  leadsThisWeek: number;
}
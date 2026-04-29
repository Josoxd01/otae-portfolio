export type AssetType = "image" | "video" | "pdf" | "embed";

export type MediaSource = "upload" | "external" | "instagram" | "youtube" | "vimeo";

export type ProjectStage = "conceptual" | "design" | "under_construction" | "built" | "completed";

export type CategoryGroup = "portfolio_area" | "typology" | "content_area";

export type ProjectMediaRole =
  | "cover"
  | "gallery"
  | "plan"
  | "render"
  | "construction"
  | "before"
  | "after"
  | "detail"
  | "context"
  | "video"
  | "walkthrough"
  | "technical_sheet";

export type ContactChannelType =
  | "email"
  | "phone"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "address"
  | "external_link";

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";

export type ContactMessageSource = "web" | "instagram" | "whatsapp" | "referral" | "other";

export interface OpeningHour {
  label: string;
  value: string;
}

export interface MediaReference {
  id?: string;
  url: string;
  assetType: AssetType;
  altText?: string;
  title?: string;
}

export interface MediaAsset {
  id: string;
  fileUrl: string;
  assetType: AssetType;
  mimeType?: string;
  title?: string;
  caption?: string;
  altText?: string;
  source: MediaSource;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryGroup: CategoryGroup;
  coverMedia?: MediaReference;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  description: string;
  location?: string;
  year?: number;
  areaM2?: number;
  projectStage?: ProjectStage;
  categoryIds: string[];
  primaryCategoryId?: string;
  coverMedia?: MediaReference;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMedia {
  id: string;
  mediaAssetId?: string;
  url: string;
  assetType: AssetType;
  mimeType?: string;
  role: ProjectMediaRole;
  title?: string;
  description?: string;
  altText?: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photoMedia?: MediaReference;
  email?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactChannel {
  id: string;
  type: ContactChannelType;
  label: string;
  value: string;
  url?: string;
  isPrimary: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  projectType?: string;
  message: string;
  source: ContactMessageSource;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface StudioProfile {
  name: string;
  legalName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  locationLabel?: string;
  mapUrl?: string;
  openingHours?: OpeningHour[];
  mission?: string;
  vision?: string;
  history?: string;
  location?: string;
  logoMedia?: MediaReference;
  heroMedia?: MediaReference;
  heroImage?: MediaReference;
  heroLabel?: string;
  heroTitle?: string;
  heroTagline?: string;
  aboutImage?: MediaReference;
  aboutTitle?: string;
  aboutText?: string;
  aboutParagraphs?: string[];
  socialLinks?: ContactChannel[];
  updatedAt?: string;
}

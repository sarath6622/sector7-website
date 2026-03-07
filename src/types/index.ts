// ─── Sanity Image ─────────────────────────────────────────────────────────────
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
}

// ─── Trainer ──────────────────────────────────────────────────────────────────
export interface Trainer {
  _id: string;
  name: string;
  slug: { current: string };
  photo: SanityImage;
  specializations: string[];
  certifications: string[];
  yearsExperience: number;
  philosophy: string;
  bio: PortableTextBlock[];
  instagramUrl?: string;
  order: number;
  isActive: boolean;
}

// ─── Transformation ───────────────────────────────────────────────────────────
export interface Transformation {
  _id: string;
  clientName: string;
  beforeImage: SanityImage;
  afterImage: SanityImage;
  durationWeeks: number;
  weightChange: number; // negative = weight loss
  goal: "Weight Loss" | "Muscle Gain" | "Recomposition";
  testimonial: string;
  trainer?: Trainer;
  videoUrl?: string;
  date: string;
  isFeatured: boolean;
}

// ─── Blog Post ────────────────────────────────────────────────────────────────
export type BlogCategory = "Workout" | "Nutrition" | "Recovery" | "Lifestyle";

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage: SanityImage;
  excerpt: string;
  category: BlogCategory;
  body: PortableTextBlock[];
  author?: Trainer;
  publishedAt: string;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
  relatedPosts?: BlogPost[];
}

// ─── Facility ─────────────────────────────────────────────────────────────────
export interface Facility {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  images: SanityImage[];
  equipmentBrands: string[];
  order: number;
}

// ─── Pricing Plan ─────────────────────────────────────────────────────────────
export interface PricingPlan {
  _id: string;
  name: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  features: string[];
  isPopular: boolean;
  order: number;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────
export interface Testimonial {
  _id: string;
  reviewerName: string;
  rating: number;
  excerpt: string;
  source: "Google" | "Direct";
  isFeatured: boolean;
  date: string;
}

// ─── Site Settings ────────────────────────────────────────────────────────────
export interface OperatingHours {
  day: string;
  open: string;
  close: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface SiteSettings {
  gymName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  operatingHours: OperatingHours[];
  socialLinks: SocialLinks;
  logo?: SanityImage;
  ogImage?: SanityImage;
}

// ─── Portable Text ───────────────────────────────────────────────────────────
// Minimal type for Sanity Portable Text blocks
export type PortableTextBlock = Record<string, unknown>;

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
export interface WhatsAppOptions {
  phone?: string;
  message: string;
  source?: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  enquiryType: "General" | "Membership" | "Personal Training" | "Corporate" | "Other";
  message: string;
  honeypot?: string;
}

export interface TrialFormData {
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: "Morning (6AM–10AM)" | "Afternoon (12PM–4PM)" | "Evening (5PM–9PM)";
  fitnessGoal: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Strength" | "Other";
  referralSource: "Google" | "Instagram" | "Friend/Family" | "Walk-in" | "Other";
  honeypot?: string;
}

export interface NewsletterFormData {
  email: string;
  honeypot?: string;
}

// ─── SEO ──────────────────────────────────────────────────────────────────────
export interface SEOPageProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

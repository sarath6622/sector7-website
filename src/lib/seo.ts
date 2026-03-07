import type { Metadata } from "next";
import type { SEOPageProps } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7gym.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Sector 7";

/**
 * Generate full Next.js Metadata object for any page.
 * Includes OG tags, Twitter cards, and canonical URL.
 */
export function generateMetadata({
  title,
  description,
  path,
  image,
}: SEOPageProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/images/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Generate JSON-LD structured data script content.
 * Pass to a <script> tag with type="application/ld+json".
 */
export function generateJSONLD(type: string, data: Record<string, unknown>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  });
}

/**
 * LocalBusiness JSON-LD — used on all pages via root layout.
 */
export function getLocalBusinessJSONLD(): Record<string, unknown> {
  return {
    "@type": "LocalBusiness",
    name: "Sector 7",
    description: "Premier gym in Kochi, Kerala — elite equipment, certified trainers, proven transformations.",
    url: SITE_URL,
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Update with actual coordinates
      latitude: "10.0261",
      longitude: "76.3085",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "05:00",
        closes: "23:00",
      },
    ],
    sameAs: [
      // Add social links when available from siteSettings
    ],
  };
}

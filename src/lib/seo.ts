import type { Metadata } from "next";
import type { SEOPageProps } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Sector 7";

/**
 * Generate full Next.js Metadata object for any page.
 * Includes OG tags, Twitter cards, canonical URL, and optional keywords.
 */
export function generateMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: SEOPageProps & { keywords?: string[] }): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/images/og-image.jpg`;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
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
export function generateJSONLD(type: string | string[], data: Record<string, unknown>): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  });
}

/**
 * Generate BreadcrumbList JSON-LD for inner pages.
 * items: [{ name, url }] — first item is typically the homepage.
 */
export function generateBreadcrumbJSONLD(
  items: { name: string; url: string }[]
): string {
  return generateJSONLD("BreadcrumbList", {
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * Default aggregate rating — mirrors the rating shown in the homepage
 * GoogleReviews section. Used as a fallback when Sanity has no override.
 * Keep in sync with the real Google Business Profile.
 */
export const DEFAULT_AGGREGATE_RATING = { ratingValue: 4.8, reviewCount: 500 };

/**
 * HealthClub / LocalBusiness JSON-LD — used on all pages via root layout.
 * Using HealthClub (subtype of LocalBusiness) for stronger local gym SEO signal.
 */
export function getLocalBusinessJSONLD(
  rating?: { ratingValue?: number | null; reviewCount?: number | null }
): Record<string, unknown> {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const ratingValue = rating?.ratingValue ?? DEFAULT_AGGREGATE_RATING.ratingValue;
  const reviewCount = rating?.reviewCount ?? DEFAULT_AGGREGATE_RATING.reviewCount;

  return {
    "@type": ["HealthClub", "LocalBusiness"],
    "@id": `${SITE_URL}/#gym`,
    name: "Sector 7",
    alternateName: "SEC7OR Fitness",
    description:
      "Premier gym in Kochi, Kerala — elite equipment, certified personal trainers, CrossFit box, and thousands of proven transformations.",
    url: SITE_URL,
    ...(phone ? { telephone: `+${phone}` } : {}),
    priceRange: "₹₹",
    image: `${SITE_URL}/images/og-image.jpg`,
    hasMap: "https://maps.app.goo.gl/X4eBYAte3Cc2x4Ky9",
    address: {
      "@type": "PostalAddress",
      streetAddress: "near Infopark Expressway, Chittethukara, Kakkanad",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      postalCode: "682037",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "9.996896",
      longitude: "76.352866",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday", "Sunday",
        ],
        opens: "05:00",
        closes: "23:00",
      },
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Strength Training Zone",   value: true },
      { "@type": "LocationFeatureSpecification", name: "Cardio Zone",              value: true },
      { "@type": "LocationFeatureSpecification", name: "CrossFit Box",             value: true },
      { "@type": "LocationFeatureSpecification", name: "Functional Training Area", value: true },
      { "@type": "LocationFeatureSpecification", name: "Personal Training",        value: true },
      { "@type": "LocationFeatureSpecification", name: "Locker Rooms",             value: true },
      { "@type": "LocationFeatureSpecification", name: "Free Parking",             value: true },
    ],
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://www.instagram.com/sector7fitness.kochi",
    ],
  };
}

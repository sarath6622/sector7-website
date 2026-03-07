import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";
const apiVersion = "2025-01-01";

// createClient requires a non-empty projectId at construction time.
// When not configured, use a sentinel so initialisation succeeds;
// isSanityConfigured = false prevents any actual network requests.
const _projectId = projectId || "unconfigured";

export const sanityClient = createClient({
  projectId: _projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Authenticated client — server-side only (ISR revalidation, mutations).
 * Never expose SANITY_API_TOKEN to the browser.
 */
export const sanityAuthClient = createClient({
  projectId: _projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Image URL builder for Sanity assets.
 *
 * Usage:
 *   urlFor(photo).width(800).height(600).url()
 */
const builder = createImageUrlBuilder({ projectId: _projectId, dataset });

// Infer the accepted image source type directly from the builder method —
// avoids sub-path type imports that break across package versions.
export type SanityImageInput = Parameters<typeof builder.image>[0];

export function urlFor(source: SanityImageInput) {
  return builder.image(source);
}

/**
 * Returns true when Sanity is configured (project ID present).
 * Use this to conditionally show Sanity data vs hardcoded fallback.
 */
export const isSanityConfigured = Boolean(projectId);

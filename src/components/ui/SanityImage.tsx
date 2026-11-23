"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

/**
 * Serves Sanity images straight from Sanity's image CDN at the width the
 * browser asked for, instead of routing them through Vercel's /_next/image
 * optimizer. That second hop re-fetched and re-encoded every image and was
 * slow on cache misses (new photos, new widths).
 *
 * Non-Sanity `src` values fall back to the default /_next/image optimizer.
 *
 * `src` should be a urlFor(...).width(W).height(H).url() result: the W/H ratio
 * (and any hotspot crop `rect`) is kept, and w/h are rescaled per srcset width.
 * auto=format serves WebP/AVIF to browsers that support them.
 */
function sanityLoader({ src, width, quality }: ImageLoaderProps): string {
  // Non-Sanity images (local /public fallbacks) keep using Vercel's optimizer.
  if (!src.startsWith("https://cdn.sanity.io/")) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
  }
  const url = new URL(src);
  const w = Number(url.searchParams.get("w"));
  const h = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(width));
  if (w > 0 && h > 0) url.searchParams.set("h", String(Math.round((width * h) / w)));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}

export function SanityImage({ alt, ...props }: Omit<ImageProps, "loader">) {
  return <Image alt={alt} {...props} loader={sanityLoader} />;
}

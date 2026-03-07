import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      // ── Sanity Studio — relaxed CSP (Studio manages its own security) ──────────
      {
        source: "/studio/(.*)",
        headers: [
          { key: "X-Frame-Options",       value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff"   },
        ],
      },
      // ── All other routes ──────────────────────────────────────────────────────
      {
        source: "/((?!studio).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://clarity.ms https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://maps.googleapis.com https://maps.gstatic.com",
              "font-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.clarity.ms https://*.sanity.io wss://*.sanity.io",
              "frame-src https://www.google.com https://maps.google.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;

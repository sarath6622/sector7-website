"use client";

/**
 * Embedded Sanity Studio at /studio
 *
 * Loaded client-only (ssr: false) to prevent Turbopack from generating
 * large server-side source maps for the Studio bundle during `next build`.
 *
 * To set up:
 * 1. Create a Sanity project: https://www.sanity.io/manage
 * 2. Copy the Project ID into .env.local → NEXT_PUBLIC_SANITY_PROJECT_ID
 * 3. Restart `npm run dev` and visit /studio
 */

import dynamicImport from "next/dynamic";

const isConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

// Import both Studio component and config lazily — client side only.
// This keeps the massive Sanity bundle out of the SSR server bundle.
// Only initialised when isConfigured is true, preventing auth errors.
const StudioClient = dynamicImport(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import("next-sanity/studio"),
      import("../../../../sanity.config"),
    ]);
    function Studio() {
      return <NextStudio config={config} />;
    }
    return Studio;
  },
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#101112",
          color: "#fff",
          fontFamily: "sans-serif",
          fontSize: "14px",
        }}
      >
        Loading Studio…
      </div>
    ),
  }
);

// Force dynamic rendering — Studio must never be statically generated.
export const dynamic = "force-dynamic";

export default function StudioPage() {
  if (!isConfigured) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#101112",
          color: "#fff",
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "520px", width: "100%" }}>
          <p style={{ color: "#FF5500", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "12px" }}>
            Studio Not Configured
          </p>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
            Set up Sanity to use the CMS
          </h1>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
            The Studio requires a Sanity project ID. Follow these steps:
          </p>
          <ol style={{ color: "#ccc", fontSize: "14px", lineHeight: 2.2, paddingLeft: "20px", marginBottom: "24px" }}>
            <li>
              Go to{" "}
              <a href="https://www.sanity.io/manage" target="_blank" rel="noreferrer" style={{ color: "#FF5500" }}>
                sanity.io/manage
              </a>{" "}
              and create a new project.
            </li>
            <li>
              Create <code style={{ background: "#1a1a1a", padding: "1px 6px" }}>.env.local</code> in the project root with:
              <pre style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "12px 16px", marginTop: "8px", fontSize: "12px", lineHeight: 1.8, overflowX: "auto", color: "#eee" }}>
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
SANITY_REVALIDATE_SECRET=any_random_secret`}
              </pre>
            </li>
            <li>Restart <code style={{ background: "#1a1a1a", padding: "1px 6px" }}>npm run dev</code> and refresh this page.</li>
          </ol>
          <p style={{ color: "#555", fontSize: "12px" }}>
            All other pages work without Sanity — they use built-in static content as a fallback.
          </p>
        </div>
      </div>
    );
  }

  return <StudioClient />;
}

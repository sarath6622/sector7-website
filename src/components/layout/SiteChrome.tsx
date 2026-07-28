"use client";

import { usePathname } from "next/navigation";
import { Navbar }          from "@/components/layout/Navbar";
import { Footer }          from "@/components/layout/Footer";
import { MobileBottomCTA } from "@/components/layout/MobileBottomCTA";
import { ScrollProgress }  from "@/components/layout/ScrollProgress";
import { CursorGlow }      from "@/components/layout/CursorGlow";

/**
 * Wraps page content with the marketing-site chrome (fixed navbar, footer,
 * bottom CTA, scroll/cursor overlays).
 *
 * The embedded Sanity Studio at /studio renders its own full-screen UI, so this
 * chrome MUST be skipped there — the fixed navbar (z-[60]) would otherwise
 * overlap the Studio and hide its top bar / fields.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileBottomCTA />
    </>
  );
}

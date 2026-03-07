"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent, GA_EVENTS } from "@/lib/analytics";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";

/**
 * Sticky bottom CTA bar — mobile only (< 768px).
 * Appears after the user scrolls past the hero section (80vh).
 * Hidden on the /free-trial page to avoid distraction.
 */
export function MobileBottomCTA() {
  const pathname  = usePathname();
  const [visible, setVisible] = useState(false);
  const isHidden  = pathname === "/free-trial";
  const waHref    = buildWhatsAppURL({ message: WA_MESSAGES.hero, source: "mobile-bottom-cta" });

  useEffect(() => {
    if (isHidden) return;

    const threshold = window.innerHeight * 0.8;
    const onScroll  = () => setVisible(window.scrollY > threshold);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHidden]);

  if (isHidden) return null;

  return (
    // Render only on mobile — hidden via CSS on md+ screens
    <div className="md:hidden">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[50] h-16 bg-bg-primary/95 backdrop-blur-md border-t border-border flex items-center"
            role="complementary"
            aria-label="Quick actions"
          >
            <div className="flex w-full">
              {/* Primary: Book Trial */}
              <Link
                href="/free-trial"
                onClick={() => trackEvent(GA_EVENTS.ctaClick, { cta_text: "Book Trial", cta_location: "mobile-bottom-bar", destination: "/free-trial" })}
                className="flex-1 flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-body font-semibold text-sm tracking-wider h-16 transition-colors"
              >
                BOOK FREE TRIAL
              </Link>

              {/* Divider */}
              <div className="w-px bg-border" aria-hidden="true" />

              {/* Secondary: WhatsApp icon */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(GA_EVENTS.whatsappClick, { source: "mobile-bottom-cta" })}
                className="w-16 flex-shrink-0 flex items-center justify-center bg-bg-primary hover:bg-surface transition-colors h-16"
                aria-label="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="#25D366" className="w-6 h-6" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

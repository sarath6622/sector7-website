"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Facilities",      href: "/facilities" },
  { label: "Trainers",        href: "/trainers" },
  { label: "Transformations", href: "/transformations" },
  { label: "About",           href: "/about" },
  { label: "Blog",            href: "/blog" },
  { label: "Pricing",         href: "/pricing" },
  { label: "Contact",         href: "/contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isFreeTrial = pathname === "/free-trial";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  if (isFreeTrial) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" aria-label="SEC7OR Fitness — home">
          <Logo variant="compact" className="text-2xl" />
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-white transition-colors font-body">
          ← Back
        </Link>
      </header>
    );
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
          scrolled
            ? "bg-bg-primary/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="container-section flex items-center justify-between h-16 md:h-20">
          <Link href="/" aria-label="SEC7OR Fitness — home">
            <Logo variant="compact" className="text-2xl md:text-3xl" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-body font-medium tracking-wide transition-colors relative group",
                  isActive(link.href)
                    ? "text-accent"
                    : "text-white/75 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full bg-accent transition-transform origin-left duration-300",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <Link
            href="/free-trial"
            className="hidden lg:inline-flex items-center bg-accent hover:bg-accent-hover text-white font-body font-semibold text-sm px-5 py-2.5 tracking-wider transition-colors accent-glow"
          >
            BOOK FREE TRIAL
          </Link>

          <button
            className="lg:hidden text-white p-2 -mr-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[80] bg-bg-primary flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-border flex-shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="SEC7OR Fitness — home">
                <Logo variant="compact" className="text-2xl" />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white p-2 -mr-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav
              className="flex flex-col flex-1 overflow-y-auto px-4 pt-6 pb-4"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block font-display text-5xl tracking-widest py-3 border-b border-border/50 transition-colors",
                      isActive(link.href) ? "text-accent" : "text-white hover:text-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="px-4 pb-8 flex flex-col gap-3 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/free-trial"
                onClick={() => setMenuOpen(false)}
                className="block bg-accent hover:bg-accent-hover text-white font-body font-semibold text-center py-4 text-sm tracking-widest transition-colors"
              >
                BOOK FREE TRIAL
              </Link>
              <a
                href={buildWhatsAppURL({ message: WA_MESSAGES.hero, source: "mobile-menu" })}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border text-white font-body font-medium text-center py-4 text-sm tracking-widest hover:border-whatsapp hover:text-whatsapp transition-colors"
              >
                CHAT ON WHATSAPP
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

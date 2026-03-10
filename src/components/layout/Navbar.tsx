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

  // Free-trial page has its own self-contained header — don't render the global nav
  if (isFreeTrial) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
          scrolled
            ? "bg-bg-primary/95 backdrop-blur-md"
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
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[80] bg-bg-primary flex flex-col lg:hidden overflow-hidden"
          >
            {/* Ambient glow — top right, visible at 0.14 opacity */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 100% 0%, rgba(255,85,0,0.14) 0%, transparent 65%)",
              }}
            />

            {/* ── Header bar ── */}
            <div className="relative flex items-center justify-between px-5 h-16 flex-shrink-0">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="SEC7OR Fitness — home">
                <Logo variant="compact" className="text-2xl" />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white transition-colors p-2 -mr-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* ── Nav links ── */}
            {/* justify-evenly distributes space uniformly — no top-heavy dead zones */}
            <nav
              className="relative flex flex-col flex-1 justify-evenly px-5 py-2"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative"
                >
                  {/* Active left bar — 3px rounded pill, always at left-0 */}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-full"
                    />
                  )}

                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 pl-5 py-1.5 group transition-colors",
                      isActive(link.href) ? "text-accent" : "text-white/75 hover:text-white"
                    )}
                  >
                    {/* Fixed-width number column — right-aligned for visual consistency */}
                    <span className="font-mono text-[10px] text-white/25 group-hover:text-accent/50 transition-colors tabular-nums w-6 text-right flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Responsive font — clamp prevents TRANSFORMATIONS overflow on small phones */}
                    <span
                      className="font-display tracking-wide leading-none"
                      style={{ fontSize: "clamp(1.75rem, 8.5vw, 2.5rem)" }}
                    >
                      {link.label}
                    </span>
                  </Link>

                  {/* Separator starts after number column, not at screen edge */}
                  {i < NAV_LINKS.length - 1 && (
                    <div className="ml-[3.25rem] h-px bg-white/5" />
                  )}
                </motion.div>
              ))}
            </nav>

            {/* ── Bottom CTAs ── */}
            <motion.div
              className="relative px-5 pb-10 pt-4 flex flex-col gap-3 flex-shrink-0 border-t border-white/5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <Link
                href="/free-trial"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-body font-semibold text-sm py-4 tracking-widest uppercase transition-colors accent-glow"
              >
                Book Free Trial
              </Link>
              {/* WhatsApp — text-white/65 meets WCAG AA contrast on dark bg */}
              <a
                href={buildWhatsAppURL({ message: WA_MESSAGES.hero, source: "mobile-menu" })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-white/65 hover:text-white font-body text-xs tracking-[0.2em] uppercase transition-colors py-2"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#25D366" }}
                />
                Chat on WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const TRUST_STATS = [
  "50+ Equipment Pieces",
  "12+ Expert Trainers",
  "3000+ Transformations",
];

/**
 * Hero — full-viewport opening section of the homepage.
 *
 * Background: CSS radial gradient (replace the `.hero-bg` div with
 * `<Image fill priority src={heroImageUrl} alt="" />` once gym photos
 * are available from Sanity CMS.
 */
export function Hero() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative min-h-dvh flex flex-col overflow-hidden bg-bg-primary">
      {/* ── Background ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 65% 35%, rgba(255,85,0,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 50% 70% at 85% 80%, rgba(255,85,0,0.05) 0%, transparent 55%),
            linear-gradient(160deg, #111111 0%, #0A0A0A 50%, #0D0D0D 100%)
          `,
        }}
      />
      <GrainOverlay opacity={0.055} />

      {/* Decorative vertical accent line */}
      <div
        aria-hidden="true"
        className="absolute left-[50%] top-0 w-px h-32 bg-gradient-to-b from-transparent via-accent/15 to-transparent hidden lg:block"
      />

      {/* ── Content ── */}
      <div className="relative z-10 container-section flex flex-col justify-center min-h-dvh pt-24 pb-24">
        <motion.div
          variants={shouldReduce ? {} : container}
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          className="flex flex-col gap-6 max-w-3xl"
        >
          {/* Label */}
          <motion.span
            variants={shouldReduce ? {} : item}
            className="font-body text-xs font-semibold tracking-[0.32em] uppercase text-accent"
          >
            Kochi's Premier Fitness Destination
          </motion.span>

          {/* Main heading */}
          <motion.h1
            variants={shouldReduce ? {} : item}
            className="font-display leading-none tracking-wide uppercase text-white"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
          >
            Where
            <br />
            <span style={{ color: "#FF5500" }}>Champions</span>
            <br />
            Are Made.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={shouldReduce ? {} : item}
            className="font-body text-white/60 text-base md:text-lg leading-relaxed max-w-lg"
          >
            World-class equipment, certified trainers, and a community that
            pushes you beyond your limits. Your transformation starts the moment
            you walk in.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={shouldReduce ? {} : item}
            className="flex flex-wrap gap-3 pt-1"
          >
            <Button variant="primary" href="/free-trial" size="lg">
              Book Free Trial
            </Button>
            <Button variant="secondary" href="/facilities" size="lg">
              Explore Facilities
            </Button>
            <Button
              variant="whatsapp"
              href={buildWhatsAppURL({ message: WA_MESSAGES.hero, source: "hero" })}
              external
              size="lg"
            >
              Chat on WhatsApp
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={shouldReduce ? {} : item}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2"
          >
            {TRUST_STATS.map((stat) => (
              <span
                key={stat}
                className="flex items-center gap-2 font-body text-sm text-white/40"
              >
                <span
                  className="w-1 h-1 rounded-full bg-accent flex-shrink-0"
                  aria-hidden="true"
                />
                {stat}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduce ? 0 : 1.6, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="font-body text-[10px] text-white/25 tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={shouldReduce ? {} : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}

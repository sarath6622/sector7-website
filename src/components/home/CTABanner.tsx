import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";

/**
 * CTABanner — full-width accent-coloured conversion banner.
 * Server Component. Sits at the bottom of the homepage before the footer.
 */
export function CTABanner() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: "#FF5500" }}
      aria-label="Call to action — book your free trial"
    >
      <GrainOverlay opacity={0.055} />

      {/* Decorative background wordmark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
      >
        <span
          className="font-display text-white/[0.04] leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(8rem, 22vw, 20rem)" }}
        >
          SEC7OR
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 container-section flex flex-col items-center text-center gap-8">
        <h2
          className="font-display text-white uppercase leading-none"
          style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
        >
          Your Transformation
          <br />
          Starts Today
        </h2>

        <p className="font-body text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
          Stop waiting for the perfect time. Your first training session is
          completely free. Come in, train hard, and leave different.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="secondary" href="/free-trial" size="lg">
            Book Your Free Trial
          </Button>
          <Button
            variant="secondary"
            href={buildWhatsAppURL({
              message: WA_MESSAGES.hero,
              source: "cta-banner",
            })}
            external
            size="lg"
          >
            Chat on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}

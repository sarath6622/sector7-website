import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * compact — inline wordmark for Navbar (SEC 7 OR)
   * full    — complete stacked logo with FITNESS + GYM CROSSFIT taglines
   */
  variant?: "compact" | "full";
  /**
   * dark  — white text + orange 7 (use on dark backgrounds)
   * light — black text + orange 7 (use on light backgrounds)
   */
  theme?: "dark" | "light";
  className?: string;
}

/**
 * SEC7OR FITNESS logo component.
 *
 * Faithfully recreates the brand identity from the design team PDF:
 * - "SEC" and "OR" in display font (Bebas Neue)
 * - Large orange "7" acts as the T, extending taller than surrounding text
 * - "FITNESS" in small tracked caps, positioned to the right of the 7
 * - "GYM CROSSFIT" tagline in tracked caps below (full variant only)
 *
 * Brand color: #FF5500 (verified from official logo PDF)
 */
export function Logo({ variant = "full", theme = "dark", className }: LogoProps) {
  const textColor = theme === "dark" ? "#FFFFFF" : "#111111";
  const mutedColor = theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const BRAND_ORANGE = "#FF5500";

  if (variant === "compact") {
    return (
      <span
        className={cn("inline-flex items-baseline leading-none select-none", className)}
        aria-label="SEC7OR Fitness"
      >
        <span
          className="font-display tracking-wide"
          style={{ color: textColor, fontSize: "1em" }}
          aria-hidden="true"
        >
          SEC
        </span>
        <span
          className="font-display"
          style={{
            color: BRAND_ORANGE,
            fontSize: "1.35em",
            lineHeight: 0.85,
            marginLeft: "0.01em",
            marginRight: "0.01em",
          }}
          aria-hidden="true"
        >
          7
        </span>
        <span
          className="font-display tracking-wide"
          style={{ color: textColor, fontSize: "1em" }}
          aria-hidden="true"
        >
          OR
        </span>
      </span>
    );
  }

  // ─── Full logo (footer, homepage hero, standalone) ────────────────────────
  return (
    <div
      className={cn("inline-flex flex-col items-start select-none", className)}
      aria-label="SEC7OR Fitness — Gym Crossfit"
    >
      {/* Main wordmark row */}
      <div className="flex items-end leading-none" aria-hidden="true">
        {/* SEC */}
        <span
          className="font-display"
          style={{
            color: textColor,
            fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          SEC
        </span>

        {/* 7 — the centrepiece, taller and orange */}
        <span
          className="font-display"
          style={{
            color: BRAND_ORANGE,
            fontSize: "clamp(3rem, 8vw, 5rem)",
            lineHeight: 0.88,
            marginLeft: "0.02em",
          }}
        >
          7
        </span>

        {/* OR + FITNESS stacked */}
        <div
          className="flex flex-col justify-end"
          style={{ gap: "0.1em", marginLeft: "0.02em" }}
        >
          {/* FITNESS — small tracked label above OR */}
          <span
            className="font-body"
            style={{
              color: mutedColor,
              fontSize: "clamp(0.45rem, 1.2vw, 0.65rem)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              lineHeight: 1,
              paddingLeft: "0.1em",
            }}
          >
            FITNESS
          </span>
          {/* OR */}
          <span
            className="font-display"
            style={{
              color: textColor,
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            OR
          </span>
        </div>
      </div>

      {/* Tagline: GYM CROSSFIT */}
      <span
        className="font-body"
        style={{
          color: mutedColor,
          fontSize: "clamp(0.5rem, 1.3vw, 0.72rem)",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          marginTop: "0.3em",
        }}
        aria-hidden="true"
      >
        GYM CROSSFIT
      </span>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface GrainOverlayProps {
  /** Opacity of the grain (0–1, default 0.04) */
  opacity?: number;
  /** Extra class names for the wrapper */
  className?: string;
}

/**
 * GrainOverlay — adds a subtle SVG film-grain texture over a section.
 * Place it as the first child of a `relative` container.
 *
 * Example:
 *   <section className="relative overflow-hidden">
 *     <GrainOverlay opacity={0.05} />
 *     {content}
 *   </section>
 *
 * The SVG turbulence filter is generated inline (no image file needed)
 * and tiled as a background-image repeat. Server-renderable.
 */
export function GrainOverlay({ opacity = 0.04, className }: GrainOverlayProps) {
  // Inline SVG turbulence filter encoded as a data URI for zero-latency load
  const svgGrain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      style={{
        backgroundImage: svgGrain,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
}

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small uppercase label above the heading (e.g. "Our Trainers") */
  label?: string;
  /** Main heading — words wrapped in <em> are rendered in accent colour */
  heading: string;
  /** Optional subtitle below the heading */
  subtitle?: string;
  /** Text alignment */
  align?: "left" | "center";
  className?: string;
  /** Rendered as h1..h6; defaults to h2 */
  as?: "h1" | "h2" | "h3" | "h4";
}

/**
 * SectionHeading — consistent section title pattern used across all pages.
 *
 * Usage:
 *   <SectionHeading
 *     label="Our Team"
 *     heading="Meet the <em>Trainers</em>"
 *     subtitle="World-class coaches dedicated to your transformation."
 *     align="center"
 *   />
 *
 * Words wrapped in <em> tags are highlighted in the brand accent colour (#FF5500).
 * All other text renders in white.
 */
export function SectionHeading({
  label,
  heading,
  subtitle,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const alignClasses = align === "center" ? "text-center items-center" : "text-left items-start";

  // Replace <em>word</em> with orange-coloured spans
  const styledHeading = heading.replace(
    /<em>(.*?)<\/em>/g,
    '<span style="color:#FF5500">$1</span>'
  );

  return (
    <div className={cn("flex flex-col gap-3", alignClasses, className)}>
      {label && (
        <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent">
          {label}
        </span>
      )}

      <Tag
        className="font-display text-4xl sm:text-5xl lg:text-6xl leading-none tracking-wide text-white uppercase"
        dangerouslySetInnerHTML={{ __html: styledHeading }}
      />

      {/* Accent underline */}
      <div
        className={cn(
          "h-px w-16 bg-accent",
          align === "center" && "self-center"
        )}
      />

      {subtitle && (
        <p className="font-body text-muted text-base leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

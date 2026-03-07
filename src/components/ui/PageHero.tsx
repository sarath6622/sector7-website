import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface PageHeroProps {
  label?: string;
  heading: string;
  subtitle?: string;
}

/**
 * PageHero — compact hero banner used at the top of all inner pages.
 * Provides consistent padding that accounts for the fixed Navbar (h-16/h-20).
 */
export function PageHero({ label, heading, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-bg-secondary border-b border-border pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      <GrainOverlay opacity={0.03} />
      <div className="relative z-10 container-section">
        <SectionHeading
          label={label}
          heading={heading}
          subtitle={subtitle}
          as="h1"
        />
      </div>
    </section>
  );
}

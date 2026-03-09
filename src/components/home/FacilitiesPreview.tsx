import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Zone {
  name: string;
  description: string;
  gradient: string;
  accentColor: string;
  /** Tailwind col-span class for the bento grid */
  colSpan?: string;
  href: string;
}

const ZONES: Zone[] = [
  {
    name: "Strength Training",
    description:
      "Olympic platforms, power racks, free weights, and cable machines. Everything you need to build raw, functional strength.",
    gradient:
      "radial-gradient(ellipse at 30% 70%, rgba(255,85,0,0.25) 0%, rgba(10,10,10,0.95) 70%)",
    accentColor: "#FF5500",
    colSpan: "lg:col-span-2",
    href: "/facilities#strength",
  },
  {
    name: "Cardio Zone",
    description:
      "Treadmills, rowers, assault bikes, and steppers. Build endurance and burn fat.",
    gradient:
      "radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.2) 0%, rgba(10,10,10,0.95) 70%)",
    accentColor: "#3B82F6",
    href: "/facilities#cardio",
  },
  {
    name: "CrossFit Box",
    description:
      "Full rig, pull-up stations, kettlebells, and open floor for WODs and functional movements.",
    gradient:
      "radial-gradient(ellipse at 30% 70%, rgba(34,197,94,0.2) 0%, rgba(10,10,10,0.95) 70%)",
    accentColor: "#22C55E",
    href: "/facilities#crossfit",
  },
  {
    name: "Functional Zone",
    description:
      "Battle ropes, TRX suspension, plyo boxes, and artificial turf for agility and conditioning.",
    gradient:
      "radial-gradient(ellipse at 70% 70%, rgba(168,85,247,0.2) 0%, rgba(10,10,10,0.95) 70%)",
    accentColor: "#A855F7",
    colSpan: "lg:col-span-2",
    href: "/facilities#functional",
  },
];

interface FacilitiesPreviewProps {
  /** Ordered array of image URLs matching ZONES order. null = use gradient. */
  facilityImages?: (string | null)[];
}

/**
 * FacilitiesPreview — bento-grid overview of the four training zones.
 * Server Component. Shows real Sanity images when provided via facilityImages prop;
 * falls back to gradient placeholders otherwise.
 */
export function FacilitiesPreview({ facilityImages = [] }: FacilitiesPreviewProps) {
  return (
    <section className="py-20 md:py-28 bg-bg-primary">
      <div className="container-section flex flex-col gap-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            label="World-Class Facilities"
            heading="Train in <em>Every</em> Zone"
            subtitle="Four purpose-built training environments, each engineered for peak performance."
          />
          <Link
            href="/facilities"
            className="flex items-center gap-2 font-body text-sm font-medium text-accent hover:text-white transition-colors whitespace-nowrap group self-start md:self-auto"
          >
            View All Facilities
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ZONES.map((zone, i) => (
            <ScrollReveal
              key={zone.name}
              delay={i * 0.07}
              className={zone.colSpan}
            >
              <Link
                href={zone.href}
                className="card-dark block relative overflow-hidden group min-h-[280px]"
                style={{ minHeight: "280px" }}
              >
                {/* Zone image or gradient fallback */}
                {facilityImages[i] ? (
                  <>
                    <Image
                      src={facilityImages[i]!}
                      alt={zone.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Dark overlay so text stays readable over photo */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.3) 60%, rgba(10,10,10,0.1) 100%)",
                      }}
                    />
                  </>
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: zone.gradient }}
                  />
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                  {/* Accent bar */}
                  <span
                    aria-hidden="true"
                    className="block h-0.5 w-8 mb-4 transition-all duration-300 group-hover:w-14"
                    style={{ backgroundColor: zone.accentColor }}
                  />
                  <h3 className="font-display text-2xl md:text-3xl tracking-wide text-white uppercase mb-2">
                    {zone.name}
                  </h3>
                  <p className="font-body text-sm text-white/55 leading-relaxed line-clamp-2 max-w-sm">
                    {zone.description}
                  </p>

                  {/* Hover arrow */}
                  <span
                    className="mt-4 flex items-center gap-1.5 font-body text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: zone.accentColor }}
                    aria-hidden="true"
                  >
                    Explore
                    <ArrowRight size={12} />
                  </span>
                </div>

                {/* Subtle hover tint */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: `${zone.accentColor}08` }}
                />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

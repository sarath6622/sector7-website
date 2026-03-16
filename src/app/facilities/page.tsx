import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ImageGallery } from "@/components/facilities/ImageGallery";
import { CheckCircle2 } from "lucide-react";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_FACILITIES_QUERY } from "@/lib/sanity/queries";
import { generateMetadata as buildMetadata, generateBreadcrumbJSONLD } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Gym Facilities — Strength Training Kochi",
  description:
    "Explore SEC7OR Fitness's world-class training zones: Strength, Cardio, CrossFit, and Functional — all under one roof in Kochi.",
  path: "/facilities",
  keywords: [
    "gym facilities Kochi", "CrossFit box Kochi", "strength training gym Kochi",
    "cardio gym Kochi", "functional training Kochi", "best equipped gym Kochi",
  ],
});

// ── Sanity type ───────────────────────────────────────────────────────────────
interface SanityFacility {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  images?: { asset?: { _ref: string }; alt?: string }[];
  equipmentList?: string[];
  order: number;
}

// ── Zone gradients (fallback palette keyed by index) ─────────────────────────
const ZONE_GRADIENTS = [
  "radial-gradient(ellipse at 30% 60%, rgba(255,85,0,0.22) 0%, rgba(10,10,10,0.97) 65%)",
  "radial-gradient(ellipse at 70% 40%, rgba(59,130,246,0.20) 0%, rgba(10,10,10,0.97) 65%)",
  "radial-gradient(ellipse at 30% 70%, rgba(34,197,94,0.18) 0%, rgba(10,10,10,0.97) 65%)",
  "radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.18) 0%, rgba(10,10,10,0.97) 65%)",
];

// ── Static fallback ───────────────────────────────────────────────────────────
interface Zone {
  id: string;
  name: string;
  description: string;
  equipment: string[];
  gradient: string;
}

const STATIC_ZONES: Zone[] = [
  {
    id: "strength",
    name: "Strength Training",
    description:
      "Our flagship strength floor is equipped with everything serious lifters need. Six power rack stations, Olympic platforms, and a full cable machine setup give you the tools to build raw, functional strength — whether you're a first-time lifter or a competitive powerlifter.",
    equipment: [
      "Olympic barbells & calibrated plates",
      "Power racks — 6 full stations",
      "Adjustable dumbbells (5–60 kg)",
      "Cable machines & pulley systems",
      "Smith machines (2 units)",
      "Bench press stations (flat, incline, decline)",
      "Preacher curl & leg extension machines",
      "Dip & pull-up stations",
    ],
    gradient: ZONE_GRADIENTS[0],
  },
  {
    id: "cardio",
    name: "Cardio Zone",
    description:
      "Burn fat, build endurance, and improve cardiovascular health in our dedicated cardio zone. With 30+ machines and enough space to keep your heart rate elevated without waiting for equipment, your conditioning sessions will never be compromised.",
    equipment: [
      "Commercial treadmills — 12 units",
      "Rowing ergometers (Concept2) — 4 units",
      "Assault bikes — 4 units",
      "Stair climbers — 2 units",
      "Elliptical trainers — 4 units",
      "Stationary & spin bikes — 6 units",
      "Cross trainers — 3 units",
    ],
    gradient: ZONE_GRADIENTS[1],
  },
  {
    id: "crossfit",
    name: "CrossFit Box",
    description:
      "A full CrossFit box with a wall-to-wall rig system, dedicated WOD space, and every piece of equipment required for legitimate functional fitness programming. Our certified CrossFit coaches run structured class sessions and open gym hours throughout the day.",
    equipment: [
      "Full wall-to-wall rig & pull-up stations",
      "Olympic barbells & bumper plates",
      "Kettlebells (4–40 kg range)",
      "Gymnastic rings & rope climbs",
      "Jump ropes & double-under ropes",
      "Plyo boxes (3 heights)",
      "GHD machines — 2 units",
      "Sled push & drag tracks",
    ],
    gradient: ZONE_GRADIENTS[2],
  },
  {
    id: "functional",
    name: "Functional Zone",
    description:
      "120 sqm of artificial turf with every tool for agility, conditioning, and athletic performance training. This zone is purpose-built for sport-specific prep, fat-loss circuits, and the kind of training that translates directly to real-world strength and movement.",
    equipment: [
      "Battle ropes — 4 stations",
      "TRX suspension trainers — 6 units",
      "Medicine balls (2–12 kg)",
      "Resistance bands (all levels)",
      "Agility ladders & cones",
      "Slam balls & wall balls",
      "120 sqm artificial turf",
      "Farmer carry handles & sleds",
    ],
    gradient: ZONE_GRADIENTS[3],
  },
];

export default async function FacilitiesPage() {
  // ── Fetch from Sanity ───────────────────────────────────────────────────────
  let sanityFacilities: SanityFacility[] | null = null;
  if (isSanityConfigured) {
    try {
      sanityFacilities = await sanityClient.fetch(ALL_FACILITIES_QUERY);
    } catch { /* fall through */ }
  }

  const usingSanity = Boolean(sanityFacilities?.length);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";
  const breadcrumbLD = generateBreadcrumbJSONLD([
    { name: "Home", url: SITE_URL },
    { name: "Facilities", url: `${SITE_URL}/facilities` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLD }} />
      <PageHero
        label="World-Class Facilities"
        heading="Train in <em>Every</em> Zone"
        subtitle="Four purpose-built training environments under one roof — each engineered for peak performance."
      />

      {/* Zone sections */}
      <div className="bg-bg-primary">
        {usingSanity
          ? sanityFacilities!.map((zone, i) => {
            const isEven = i % 2 === 0;
            const gradient = ZONE_GRADIENTS[i % ZONE_GRADIENTS.length];
            const galleryImages = (zone.images ?? [])
              .filter((img) => img.asset)
              .map((img) => ({
                url: urlFor(img).width(1200).height(900).url(),
                alt: img.alt ?? zone.name,
              }));

            return (
              <section
                key={zone._id}
                id={zone.slug}
                className={`py-20 md:py-28 ${i % 2 !== 0 ? "bg-bg-secondary" : ""} border-b border-border`}
              >
                <div className="container-section">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                    {/* Gallery */}
                    <ScrollReveal direction={isEven ? "left" : "right"} className={!isEven ? "lg:col-start-2" : ""}>
                      <ImageGallery
                        images={galleryImages}
                        gradient={gradient}
                        zoneName={zone.name}
                      />
                    </ScrollReveal>

                    {/* Content */}
                    <ScrollReveal direction={isEven ? "right" : "left"} className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                      <div className="flex flex-col gap-6">
                        <div>
                          <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-3 block">
                            Zone 0{i + 1}
                          </span>
                          <h2 className="font-display text-4xl md:text-5xl tracking-wide text-white uppercase mb-4">
                            {zone.name}
                          </h2>
                          <p className="font-body text-white/65 text-base leading-relaxed">
                            {zone.description}
                          </p>
                        </div>

                        {(zone.equipmentList?.length ?? 0) > 0 && (
                          <div>
                            <h3 className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted mb-3">
                              Equipment
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {zone.equipmentList!.map((item) => (
                                <li key={item} className="flex items-start gap-2 font-body text-sm text-white/70">
                                  <CheckCircle2 size={14} className="text-accent mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </section>
            );
          })
          : // ── Static fallback ───────────────────────────────────────────────
          STATIC_ZONES.map((zone, i) => {
            const isEven = i % 2 === 0;
            return (
              <section
                key={zone.id}
                id={zone.id}
                className={`py-20 md:py-28 ${i % 2 !== 0 ? "bg-bg-secondary" : ""} border-b border-border`}
              >
                <div className="container-section">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                    <ScrollReveal direction={isEven ? "left" : "right"} className={!isEven ? "lg:col-start-2" : ""}>
                      <div
                        className="relative overflow-hidden border border-border"
                        style={{ aspectRatio: "4/3", background: zone.gradient }}
                      >
                        <div className="absolute inset-0 flex items-end p-8">
                          <span className="font-display text-4xl text-white/10 uppercase tracking-widest">
                            {zone.name}
                          </span>
                        </div>
                      </div>
                    </ScrollReveal>
                    <ScrollReveal direction={isEven ? "right" : "left"} className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                      <div className="flex flex-col gap-6">
                        <div>
                          <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-3 block">
                            Zone 0{i + 1}
                          </span>
                          <h2 className="font-display text-4xl md:text-5xl tracking-wide text-white uppercase mb-4">
                            {zone.name}
                          </h2>
                          <p className="font-body text-white/65 text-base leading-relaxed">
                            {zone.description}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted mb-3">
                            Equipment
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {zone.equipment.map((item) => (
                              <li key={item} className="flex items-start gap-2 font-body text-sm text-white/70">
                                <CheckCircle2 size={14} className="text-accent mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </section>
            );
          })}
      </div>

      <CTABanner />
    </>
  );
}

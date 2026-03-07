import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { SITE_SETTINGS_ABOUT_QUERY } from "@/lib/sanity/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — SEC7OR Fitness",
  description:
    "The story of SEC7OR Fitness — Kochi's premier gym. Founded in 2019 with a mission to make world-class fitness coaching accessible across Kerala.",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface TimelineEvent { year: string; title: string; description: string; }
interface GymValue { title: string; description: string; }

// ── Static fallbacks ──────────────────────────────────────────────────────────
const STATIC_TIMELINE: TimelineEvent[] = [
  { year: "2019", title: "Founded", description: "SEC7OR Fitness opens its doors in Kochi with 2000 sqft, 3 trainers, and a clear mission: no-nonsense coaching for real results." },
  { year: "2020", title: "CrossFit Box Added", description: "Expanded to include a dedicated CrossFit box and brought on certified CrossFit coaches. First structured group class programmes launched." },
  { year: "2021", title: "500 Members", description: "Crossed 500 active members — a milestone that validated the approach of quality coaching over mass-market gym culture." },
  { year: "2022", title: "Expanded to 6000 sqft", description: "Major expansion: added the Functional Zone, additional strength platforms, and a dedicated recovery area." },
  { year: "2023", title: "1000 Documented Transformations", description: "Our transformation tracker hit 1000 documented results — making SEC7OR the most transformation-focused gym in Kerala." },
  { year: "2024", title: "Kerala's Best Gym", description: "Rated Kerala's Best Independent Gym by FitIndia magazine readers. Expanded coaching team to 12 certified professionals." },
];

const STATIC_VALUES: GymValue[] = [
  { title: "No Shortcuts", description: "We don't sell magic programmes or quick fixes. Every result here was earned through consistency, smart training, and proper nutrition." },
  { title: "Evidence-Based", description: "Every training approach we use is backed by exercise science, not trending social media content. Your time is too valuable for bro-science." },
  { title: "Community First", description: "A gym is only as good as the people inside it. We've built a culture where members push each other forward and celebrate each other's wins." },
  { title: "Accessible Excellence", description: "World-class coaching doesn't have to mean Bangalore or Mumbai prices. We're making it happen right here in Kochi." },
];

export default async function AboutPage() {
  // ── Fetch from Sanity ───────────────────────────────────────────────────────
  let timelineEvents: TimelineEvent[] = STATIC_TIMELINE;
  let gymValues: GymValue[] = STATIC_VALUES;

  if (isSanityConfigured) {
    try {
      const settings = await sanityClient.fetch<{
        timelineEvents?: TimelineEvent[];
        gymValues?: GymValue[];
      } | null>(SITE_SETTINGS_ABOUT_QUERY);
      if (settings?.timelineEvents?.length) timelineEvents = settings.timelineEvents;
      if (settings?.gymValues?.length) gymValues = settings.gymValues;
    } catch { /* fall through */ }
  }

  return (
    <>
      <PageHero
        label="Our Story"
        heading="Built for <em>Champions</em>"
        subtitle="SEC7OR wasn't built to be just another gym. It was built to be the gym that actually changes people's lives."
      />

      {/* Mission */}
      <section className="py-20 md:py-28 bg-bg-primary border-b border-border">
        <div className="container-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div
                className="relative border border-border overflow-hidden"
                style={{
                  aspectRatio: "4/3",
                  background:
                    "radial-gradient(ellipse at 30% 60%, rgba(255,85,0,0.18) 0%, rgba(10,10,10,0.97) 65%)",
                }}
              >
                <div className="absolute inset-0 flex items-end p-8">
                  <span className="font-display text-5xl text-white/8 uppercase">
                    SEC7OR FITNESS
                  </span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="flex flex-col gap-6">
                <SectionHeading
                  label="Our Mission"
                  heading="More Than a <em>Gym</em>"
                />
                <div className="flex flex-col gap-4 font-body text-white/65 text-base leading-relaxed">
                  <p>
                    We started SEC7OR because we were tired of gyms that took
                    your money and left you to figure it out alone. Kochi
                    deserves better — and we decided to build it.
                  </p>
                  <p>
                    Our mission is simple: give every member in Kochi access to
                    the kind of coaching, equipment, and community that was
                    previously only available in the country's biggest metro
                    cities.
                  </p>
                  <p>
                    Every decision we make — from the equipment we buy to the
                    coaches we hire to the programmes we design — is made with
                    one question in mind: does this make our members better?
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-bg-secondary border-b border-border">
        <div className="container-section flex flex-col gap-12">
          <SectionHeading
            label="What We Stand For"
            heading="Our <em>Values</em>"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gymValues.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.07}>
                <div className="card-dark p-7 flex flex-col gap-3 h-full">
                  <span className="font-display text-2xl tracking-wide text-accent uppercase">
                    {v.title}
                  </span>
                  <p className="font-body text-sm text-white/65 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-bg-primary border-b border-border">
        <div className="container-section flex flex-col gap-12">
          <SectionHeading
            label="Our Journey"
            heading="The <em>Timeline</em>"
          />
          <div className="flex flex-col gap-0">
            {timelineEvents.map((event, i) => (
              <ScrollReveal key={`${event.year}-${i}`} delay={i * 0.06}>
                <div className="grid grid-cols-[80px_1fr] gap-6 pb-10 relative">
                  {i < timelineEvents.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-[39px] top-8 bottom-0 w-px bg-border"
                    />
                  )}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="w-4 h-4 rounded-full bg-accent flex-shrink-0 ring-4 ring-bg-primary" />
                    <span className="font-mono text-xs font-bold text-accent">
                      {event.year}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 pb-2">
                    <h3 className="font-display text-2xl tracking-wide text-white uppercase">
                      {event.title}
                    </h3>
                    <p className="font-body text-sm text-white/60 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

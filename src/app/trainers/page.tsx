import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_TRAINERS_QUERY } from "@/lib/sanity/queries";
import { generateMetadata as buildMetadata, generateBreadcrumbJSONLD } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Personal Trainers in Kochi — SEC7OR Fitness",
  description:
    "Meet SEC7OR Fitness's team of certified coaches — specialists in strength, CrossFit, nutrition, functional training, boxing, and recovery.",
  path: "/trainers",
  keywords: [
    "personal trainer Kochi", "certified trainer Kochi", "gym coach Kochi",
    "CrossFit coach Kochi", "fitness coach Kerala", "strength coach Kochi",
  ],
});

// ── Sanity data type ─────────────────────────────────────────────────────────
export interface SanityTrainer {
  _id: string;
  name: string;
  slug: string;
  photo?: { asset?: { _ref: string } };
  title: string;
  specializations: string[];
  certifications: string[];
  experience: number;
  bio: string;
  order?: number;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function TrainersPage() {
  let trainers: SanityTrainer[] = [];

  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<SanityTrainer[]>(ALL_TRAINERS_QUERY);
      if (data?.length) trainers = data;
    } catch { /* fall through */ }
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";
  const breadcrumbLD = generateBreadcrumbJSONLD([
    { name: "Home", url: SITE_URL },
    { name: "Trainers", url: `${SITE_URL}/trainers` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLD }} />
      <PageHero
        label="Expert Guidance"
        heading="Meet the <em>Trainers</em>"
        subtitle="Certified coaches, each a specialist in their discipline — ready to get you results."
      />

      <section className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section">
          {trainers.length === 0 ? (
            <p className="font-body text-muted text-sm text-center py-12">
              Our trainer profiles are being set up — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer, i) => {
                const photoUrl = trainer.photo?.asset
                  ? urlFor(trainer.photo).width(480).height(640).url()
                  : null;
                return (
                  <ScrollReveal key={trainer._id} delay={i * 0.06}>
                    <Link
                      href={`/trainers/${trainer.slug}`}
                      className="card-dark block group overflow-hidden"
                    >
                      <div className="relative" style={{ aspectRatio: "3/4" }}>
                        {photoUrl ? (
                          <Image
                            src={photoUrl}
                            alt={trainer.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.20) 0%, rgba(20,20,20,0.95) 65%)",
                            }}
                          />
                        )}
                        <span className="absolute top-4 right-4 font-body text-xs text-white/40 tracking-wider z-10">
                          {trainer.experience} yrs
                        </span>
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-accent/0 group-hover:bg-accent/6 transition-colors duration-300 z-10"
                        />
                      </div>
                      <div className="p-5 flex flex-col gap-2.5">
                        <div>
                          <h2 className="font-display text-2xl tracking-wide text-white uppercase leading-none mb-0.5">
                            {trainer.name}
                          </h2>
                          <p className="font-body text-xs text-accent tracking-wider">
                            {trainer.title}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(trainer.specializations ?? []).slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="font-body text-[11px] text-muted border border-border/70 px-2 py-0.5"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <span className="font-body text-xs text-accent/70 group-hover:text-accent transition-colors mt-1">
                          View Profile →
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

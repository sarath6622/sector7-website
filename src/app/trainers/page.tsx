import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_TRAINERS_QUERY } from "@/lib/sanity/queries";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Trainers — SEC7OR Fitness",
  description:
    "Meet SEC7OR Fitness's team of certified coaches — specialists in strength, CrossFit, nutrition, functional training, boxing, and recovery.",
};

export interface Trainer {
  name: string;
  slug: string;
  title: string;
  specializations: string[];
  certifications: string[];
  experience: number;
  bio: string;
  gradient: string;
}

// ── Static fallback data ─────────────────────────────────────────────────────
// Used when Sanity is not yet configured or returns no results.
// Also imported by /trainers/[slug]/page.tsx and /blog/[slug]/page.tsx
// for their own fallback lookups.
export const TRAINERS: Trainer[] = [
  {
    name: "Arjun Menon",
    slug: "arjun-menon",
    title: "Head Strength Coach",
    specializations: ["Powerlifting", "Hypertrophy", "Body Transformation"],
    certifications: ["NSCA-CSCS", "ACE-CPT", "ISSA Strength & Conditioning"],
    experience: 8,
    bio: "Arjun has coached over 400 clients ranging from complete beginners to competitive powerlifters. His programming is built on evidence-based principles — progressive overload, periodization, and sustainable habit formation. He specialises in body recomposition and strength sport prep.",
    gradient:
      "radial-gradient(ellipse at 40% 75%, rgba(255,85,0,0.30) 0%, rgba(20,20,20,0.95) 65%)",
  },
  {
    name: "Priya Nair",
    slug: "priya-nair",
    title: "CrossFit L2 Coach",
    specializations: ["CrossFit", "HIIT", "Olympic Lifting"],
    certifications: ["CrossFit L2 Certificate", "USAW Sports Performance Coach", "CPR/AED"],
    experience: 6,
    bio: "Priya brings competition-level CrossFit coaching to athletes of all abilities. She holds a CrossFit Level 2 certificate and has competed regionally across South India. Her coaching philosophy centres on movement quality first — intensity follows technique.",
    gradient:
      "radial-gradient(ellipse at 60% 25%, rgba(59,130,246,0.25) 0%, rgba(20,20,20,0.95) 65%)",
  },
  {
    name: "Rohit Kumar",
    slug: "rohit-kumar",
    title: "Nutrition & Body Coach",
    specializations: ["Nutrition Planning", "Weight Loss", "Muscle Gain"],
    certifications: ["Precision Nutrition L1", "ISSA Nutritionist", "ACE Health Coach"],
    experience: 7,
    bio: "Rohit blends training and nutrition under one roof — no crash diets, no cookie-cutter meal plans. His transformation clients follow sustainable, food-culture-aware protocols that work with Indian lifestyles. He has overseen 200+ documented transformations.",
    gradient:
      "radial-gradient(ellipse at 40% 75%, rgba(34,197,94,0.22) 0%, rgba(20,20,20,0.95) 65%)",
  },
  {
    name: "Sana Thomas",
    slug: "sana-thomas",
    title: "Functional Fitness Coach",
    specializations: ["Functional Training", "Cardio", "Flexibility"],
    certifications: ["NASM-CPT", "TRX Suspension Training", "Kettlebell Instructor"],
    experience: 5,
    bio: "Sana designs training programmes that make everyday movement easier and pain-free. She specialises in functional fitness for desk workers, seniors, and post-injury clients who need to rebuild their base before pushing intensity. Her sessions are challenging but always body-aware.",
    gradient:
      "radial-gradient(ellipse at 60% 25%, rgba(168,85,247,0.22) 0%, rgba(20,20,20,0.95) 65%)",
  },
  {
    name: "Vikram Das",
    slug: "vikram-das",
    title: "Boxing & Conditioning Coach",
    specializations: ["Boxing", "MMA Conditioning", "Athletic Performance"],
    certifications: ["AIBA Certified Boxing Coach", "NSCA-CPT", "Sports Nutrition Diploma"],
    experience: 9,
    bio: "Vikram trained as a competitive boxer for 12 years before transitioning to coaching. His conditioning circuits are brutally effective — built from fight-camp methodology and adapted for general fitness clients who want to build real-world athleticism and mental toughness.",
    gradient:
      "radial-gradient(ellipse at 40% 75%, rgba(239,68,68,0.22) 0%, rgba(20,20,20,0.95) 65%)",
  },
  {
    name: "Ananya Pillai",
    slug: "ananya-pillai",
    title: "Yoga & Recovery Coach",
    specializations: ["Yoga", "Mobility", "Recovery Protocols"],
    certifications: ["RYT-500 (Yoga Alliance)", "NSCA Corrective Exercise", "Sports Massage Diploma"],
    experience: 4,
    bio: "Ananya bridges the gap between hard training and smart recovery. Her sessions cover mobility work, breath practice, and active recovery protocols that reduce injury risk and accelerate performance gains. She works closely with SEC7OR's strength coaches to design complementary recovery programming.",
    gradient:
      "radial-gradient(ellipse at 60% 25%, rgba(251,191,36,0.20) 0%, rgba(20,20,20,0.95) 65%)",
  },
];

// ── Sanity data type ─────────────────────────────────────────────────────────
interface SanityTrainer {
  _id: string;
  name: string;
  slug: string;
  photo?: { asset?: { _ref: string } };
  title: string;
  specializations: string[];
  certifications: string[];
  experience: number;
  bio: string;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function TrainersPage() {
  // Try to load from Sanity; silently fall back to static data on failure
  let sanityTrainers: SanityTrainer[] | null = null;
  if (isSanityConfigured) {
    try {
      sanityTrainers = await sanityClient.fetch(ALL_TRAINERS_QUERY);
    } catch {
      // Sanity not reachable — use static fallback
    }
  }

  const usingSanity = Boolean(sanityTrainers?.length);

  return (
    <>
      <PageHero
        label="Expert Guidance"
        heading="Meet the <em>Trainers</em>"
        subtitle="Six certified coaches, each a specialist in their discipline — ready to get you results."
      />

      <section className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {usingSanity
              ? // ── Sanity data ──────────────────────────────────────────────
                sanityTrainers!.map((trainer, i) => {
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
                            {trainer.specializations.slice(0, 2).map((s) => (
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
                })
              : // ── Static fallback ──────────────────────────────────────────
                TRAINERS.map((trainer, i) => (
                  <ScrollReveal key={trainer.slug} delay={i * 0.06}>
                    <Link
                      href={`/trainers/${trainer.slug}`}
                      className="card-dark block group overflow-hidden"
                    >
                      <div
                        className="relative"
                        style={{ aspectRatio: "3/4", background: trainer.gradient }}
                      >
                        <span className="absolute top-4 right-4 font-body text-xs text-white/40 tracking-wider">
                          {trainer.experience} yrs
                        </span>
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-accent/0 group-hover:bg-accent/6 transition-colors duration-300"
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
                          {trainer.specializations.slice(0, 2).map((s) => (
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
                ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

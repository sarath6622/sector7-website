import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import {
  TRAINER_BY_SLUG_QUERY,
  TRAINER_SLUGS_QUERY,
  TRANSFORMATIONS_BY_TRAINER_QUERY,
} from "@/lib/sanity/queries";
import { generateJSONLD, generateBreadcrumbJSONLD } from "@/lib/seo";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<{ slug: string }[]>(TRAINER_SLUGS_QUERY);
      if (data?.length) return data.map(({ slug }) => ({ slug }));
    } catch { /* fall through */ }
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";

  if (isSanityConfigured) {
    try {
      const t = await sanityClient.fetch<{ name: string; bio?: string } | null>(
        TRAINER_BY_SLUG_QUERY,
        { slug }
      );
      if (t) {
        const desc = (t.bio ?? `Certified fitness coach at SEC7OR Gym Kochi. Specialising in strength and conditioning.`).slice(0, 155);
        return {
          title: `${t.name} — Personal Trainer Kochi`,
          description: desc,
          alternates: { canonical: `${SITE_URL}/trainers/${slug}` },
          openGraph: {
            title: `${t.name} — SEC7OR Fitness`,
            description: desc,
            url: `${SITE_URL}/trainers/${slug}`,
          },
          twitter: { card: "summary_large_image", title: `${t.name} — SEC7OR Fitness`, description: desc },
        };
      }
    } catch { /* fall through */ }
  }

  return {};
}

interface SanityTrainerFull {
  _id: string;
  name: string;
  slug: string;
  photo?: { asset?: { _ref: string } };
  title?: string;
  specializations?: string[];
  certifications?: string[];
  experience?: number;
  bio?: string;
}

interface SanityTransformation {
  _id: string;
  clientName: string;
  beforeImage?: { asset?: { _ref: string } };
  afterImage?: { asset?: { _ref: string } };
  durationMonths: number;
  weightChange?: number;
  changeLabel?: string;
  goal: string;
  testimonial?: string;
}

export default async function TrainerProfilePage({ params }: Props) {
  const { slug } = await params;

  let trainer: SanityTrainerFull | null = null;

  if (isSanityConfigured) {
    try {
      trainer = await sanityClient.fetch(TRAINER_BY_SLUG_QUERY, { slug });
    } catch { /* fall through */ }
  }

  if (!trainer) notFound();

  // Fetch transformations linked to this trainer
  let transformations: SanityTransformation[] = [];
  if (isSanityConfigured && trainer._id) {
    try {
      transformations = await sanityClient.fetch(
        TRANSFORMATIONS_BY_TRAINER_QUERY,
        { trainerId: trainer._id }
      );
    } catch { /* fall through */ }
  }

  const photoUrl = trainer.photo?.asset
    ? urlFor(trainer.photo).width(640).height(800).url()
    : null;

  const name = trainer.name ?? "Trainer";
  const title = trainer.title ?? "Coach";
  const experience = trainer.experience ?? 0;
  const bio = trainer.bio ?? "";
  const specializations = trainer.specializations ?? [];
  const certifications = trainer.certifications ?? [];
  const gradient = "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.20) 0%, rgba(20,20,20,0.95) 65%)";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";

  const breadcrumbLD = generateBreadcrumbJSONLD([
    { name: "Home", url: SITE_URL },
    { name: "Trainers", url: `${SITE_URL}/trainers` },
    { name, url: `${SITE_URL}/trainers/${slug}` },
  ]);

  const personLD = generateJSONLD("Person", {
    name,
    jobTitle: title,
    description: bio || `Certified fitness coach at SEC7OR Gym Kochi.`,
    worksFor: { "@type": "LocalBusiness", name: "Sector 7", url: SITE_URL },
    url: `${SITE_URL}/trainers/${slug}`,
    ...(photoUrl ? { image: photoUrl } : {}),
    ...(certifications.length ? { hasCredential: certifications.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c })) } : {}),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLD }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personLD }} />
      {/* Back link */}
      <div className="bg-bg-secondary border-b border-border pt-24 pb-0">
        <div className="container-section py-4">
          <Link
            href="/trainers"
            className="flex items-center gap-2 font-body text-sm text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            All Trainers
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-bg-secondary border-b border-border">
        <div className="container-section py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div
              className="border border-border overflow-hidden relative"
              style={{ aspectRatio: "4/5", background: photoUrl ? undefined : gradient }}
            >
              {photoUrl && (
                <Image
                  src={photoUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2">
                  {experience} Years Experience
                </span>
                <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white uppercase leading-none mb-1">
                  {name}
                </h1>
                <p className="font-body text-base text-accent tracking-wider">{title}</p>
              </div>

              {bio && (
                <p className="font-body text-white/65 text-base leading-relaxed">{bio}</p>
              )}

              {/* Specializations */}
              {specializations.length > 0 && (
                <div>
                  <h2 className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted mb-3">
                    Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((s) => (
                      <span
                        key={s}
                        className="font-body text-sm text-white border border-accent/40 bg-accent/5 px-3 py-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <h2 className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted mb-3 flex items-center gap-2">
                    <Award size={13} className="text-muted" />
                    Certifications
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {certifications.map((cert) => (
                      <li
                        key={cert}
                        className="flex items-center gap-2 font-body text-sm text-white/70"
                      >
                        <CheckCircle2 size={13} className="text-accent flex-shrink-0" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" href="/free-trial">
                  Book a Session
                </Button>
                <Button
                  variant="whatsapp"
                  href={buildWhatsAppURL({
                    message: WA_MESSAGES.trainer(name),
                    source: `trainer-${slug}`,
                  })}
                  external
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Transformations */}
      <section className="py-20 bg-bg-primary border-b border-border">
        <div className="container-section flex flex-col gap-10">
          <div>
            <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2">
              Results
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-wide text-white uppercase">
              Client Transformations
            </h2>
          </div>

          {transformations.length === 0 ? (
            <p className="font-body text-muted text-sm">
              Transformations from {name} will appear here once added to the CMS.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t) => {
                const afterUrl = t.afterImage?.asset ? urlFor(t.afterImage).width(400).height(530).url() : null;
                const beforeUrl = t.beforeImage?.asset ? urlFor(t.beforeImage).width(400).height(530).url() : null;

                const changeLabel =
                  t.changeLabel ??
                  (t.weightChange != null
                    ? t.weightChange > 0
                      ? `+${t.weightChange} kg`
                      : `${t.weightChange} kg`
                    : null);

                return (
                  <div key={t._id} className="card-dark overflow-hidden flex flex-col">
                    {/* After/Before images */}
                    <div className="grid grid-cols-2 gap-px">
                      {["Before", "After"].map((label, idx) => {
                        const imgUrl = idx === 0 ? beforeUrl : afterUrl;
                        return (
                          <div
                            key={label}
                            className="relative overflow-hidden"
                            style={{ aspectRatio: "3/4", background: gradient }}
                          >
                            {imgUrl && (
                              <Image
                                src={imgUrl}
                                alt={`${t.clientName} ${label.toLowerCase()}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                              />
                            )}
                            <span className="absolute bottom-2 left-2 font-body text-[10px] text-white/60 tracking-wider uppercase bg-black/40 px-1.5 py-0.5">
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-xl tracking-wide text-white uppercase">
                          {t.clientName}
                        </span>
                        {changeLabel && (
                          <span className="font-mono text-base font-bold text-accent">
                            {changeLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-body text-xs text-muted tracking-wider">
                          {t.goal}
                        </span>
                        <span className="text-border">·</span>
                        <span className="font-body text-xs text-muted">
                          {t.durationMonths} month{t.durationMonths !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {t.testimonial && (
                        <p className="font-body text-sm text-white/50 leading-relaxed italic mt-1 line-clamp-3">
                          &ldquo;{t.testimonial}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

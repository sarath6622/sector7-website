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
} from "@/lib/sanity/queries";

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

  if (isSanityConfigured) {
    try {
      const t = await sanityClient.fetch<{ name: string; bio?: string } | null>(
        TRAINER_BY_SLUG_QUERY,
        { slug }
      );
      if (t) return {
        title: `${t.name} — SEC7OR Fitness`,
        description: (t.bio ?? "").slice(0, 155),
      };
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

export default async function TrainerProfilePage({ params }: Props) {
  const { slug } = await params;

  let trainer: SanityTrainerFull | null = null;

  if (isSanityConfigured) {
    try {
      trainer = await sanityClient.fetch(TRAINER_BY_SLUG_QUERY, { slug });
    } catch { /* fall through */ }
  }

  if (!trainer) notFound();

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

  return (
    <>
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

      {/* Client transformations placeholder */}
      <section className="py-20 bg-bg-primary border-b border-border">
        <div className="container-section text-center">
          <p className="font-body text-muted text-sm">
            Client transformations from {name} will appear here once added to the CMS.
          </p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { TRAINERS } from "@/app/trainers/page";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TRAINERS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trainer = TRAINERS.find((t) => t.slug === slug);
  if (!trainer) return {};
  return {
    title: `${trainer.name} — SEC7OR Fitness`,
    description: trainer.bio.slice(0, 155),
  };
}

export default async function TrainerProfilePage({ params }: Props) {
  const { slug } = await params;
  const trainer = TRAINERS.find((t) => t.slug === slug);
  if (!trainer) notFound();

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
            {/* Photo placeholder */}
            <div
              className="border border-border overflow-hidden"
              style={{ aspectRatio: "4/5", background: trainer.gradient }}
            >
              {/* TODO: Replace with <Image fill src={trainer.photoUrl} alt={trainer.name} className="object-cover" /> */}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-2">
                  {trainer.experience} Years Experience
                </span>
                <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white uppercase leading-none mb-1">
                  {trainer.name}
                </h1>
                <p className="font-body text-base text-accent tracking-wider">
                  {trainer.title}
                </p>
              </div>

              <p className="font-body text-white/65 text-base leading-relaxed">
                {trainer.bio}
              </p>

              {/* Specializations */}
              <div>
                <h2 className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted mb-3">
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {trainer.specializations.map((s) => (
                    <span
                      key={s}
                      className="font-body text-sm text-white border border-accent/40 bg-accent/5 px-3 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted mb-3 flex items-center gap-2">
                  <Award size={13} className="text-muted" />
                  Certifications
                </h2>
                <ul className="flex flex-col gap-2">
                  {trainer.certifications.map((cert) => (
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

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" href="/free-trial">
                  Book a Session
                </Button>
                <Button
                  variant="whatsapp"
                  href={buildWhatsAppURL({
                    message: WA_MESSAGES.trainer(trainer.name),
                    source: `trainer-${trainer.slug}`,
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

      {/* Placeholder — transformations will be populated from Sanity in Phase 8 */}
      <section className="py-20 bg-bg-primary border-b border-border">
        <div className="container-section text-center">
          <p className="font-body text-muted text-sm">
            Client transformations from {trainer.name} will appear here once Sanity CMS is connected (Phase 8).
          </p>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/lib/sanity/client";

export interface TrainerPreviewItem {
  _id: string;
  name: string;
  slug: string;
  title: string;
  specializations: string[];
  experience: number;
  photo?: { asset?: { _ref: string } };
}

interface Props {
  trainers: TrainerPreviewItem[];
}

/**
 * TrainersPreview — 4-card grid of featured trainers.
 * Server Component. Data fetched by the homepage server component and passed as props.
 */
export function TrainersPreview({ trainers }: Props) {
  if (!trainers.length) return null;

  return (
    <section className="py-20 md:py-28 bg-bg-primary">
      <div className="container-section flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            label="Expert Guidance"
            heading="Meet the <em>Trainers</em>"
            subtitle="Certified professionals who have transformed hundreds of lives in Kochi."
          />
          <Link
            href="/trainers"
            className="flex items-center gap-2 font-body text-sm font-medium text-accent hover:text-white transition-colors whitespace-nowrap group self-start md:self-auto"
          >
            Meet the Full Team
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trainers.slice(0, 4).map((trainer, i) => {
            const photoUrl = trainer.photo?.asset
              ? urlFor(trainer.photo).width(320).height(427).url()
              : null;

            return (
              <ScrollReveal key={trainer._id} delay={i * 0.07}>
                <Link
                  href={`/trainers/${trainer.slug}`}
                  className="card-dark block group overflow-hidden"
                >
                  <div
                    className="relative"
                    style={{
                      aspectRatio: "3/4",
                      background: photoUrl
                        ? undefined
                        : "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.20) 0%, rgba(20,20,20,0.95) 65%)",
                    }}
                  >
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={trainer.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      />
                    ) : null}
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
                      <h3 className="font-display text-xl tracking-wide text-white uppercase leading-none mb-0.5">
                        {trainer.name}
                      </h3>
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
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" href="/trainers">
            View All Trainers
          </Button>
        </div>
      </div>
    </section>
  );
}

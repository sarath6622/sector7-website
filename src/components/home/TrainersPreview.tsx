import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";

interface Trainer {
  name: string;
  title: string;
  specializations: string[];
  experience: number;
  gradient: string;
  slug: string;
}

const TRAINERS: Trainer[] = [
  {
    name: "Arjun Menon",
    title: "Head Strength Coach",
    specializations: ["Powerlifting", "Hypertrophy", "Body Transformation"],
    experience: 8,
    gradient:
      "radial-gradient(ellipse at 40% 80%, rgba(255,85,0,0.30) 0%, rgba(20,20,20,0.95) 65%)",
    slug: "arjun-menon",
  },
  {
    name: "Priya Nair",
    title: "CrossFit Specialist",
    specializations: ["CrossFit", "HIIT", "Olympic Lifting"],
    experience: 6,
    gradient:
      "radial-gradient(ellipse at 60% 20%, rgba(59,130,246,0.25) 0%, rgba(20,20,20,0.95) 65%)",
    slug: "priya-nair",
  },
  {
    name: "Rohit Kumar",
    title: "Nutrition & Body Coach",
    specializations: ["Nutrition", "Weight Loss", "Muscle Gain"],
    experience: 7,
    gradient:
      "radial-gradient(ellipse at 40% 80%, rgba(34,197,94,0.22) 0%, rgba(20,20,20,0.95) 65%)",
    slug: "rohit-kumar",
  },
  {
    name: "Sana Thomas",
    title: "Functional Fitness Coach",
    specializations: ["Functional Training", "Cardio", "Flexibility"],
    experience: 5,
    gradient:
      "radial-gradient(ellipse at 60% 20%, rgba(168,85,247,0.22) 0%, rgba(20,20,20,0.95) 65%)",
    slug: "sana-thomas",
  },
];

/**
 * TrainersPreview — 4-card grid of featured trainers.
 * Server Component. Card backgrounds are gradient placeholders —
 * replace the gradient div with `<Image fill src={trainer.photoUrl} alt="" />`
 * once Sanity trainer profiles are set up.
 */
export function TrainersPreview() {
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
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRAINERS.map((trainer, i) => (
            <ScrollReveal key={trainer.slug} delay={i * 0.07}>
              <Link
                href={`/trainers/${trainer.slug}`}
                className="card-dark block group overflow-hidden"
              >
                {/* Photo placeholder — replace with next/image */}
                <div
                  className="relative"
                  style={{ aspectRatio: "3/4", background: trainer.gradient }}
                >
                  {/* Experience badge */}
                  <span className="absolute top-4 right-4 font-body text-xs text-white/40 tracking-wider">
                    {trainer.experience} yrs
                  </span>
                  {/* Hover tint */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-accent/0 group-hover:bg-accent/6 transition-colors duration-300"
                  />
                </div>

                {/* Info */}
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
                    {trainer.specializations.slice(0, 2).map((s) => (
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
          ))}
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

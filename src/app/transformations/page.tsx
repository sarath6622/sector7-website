import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Transformations — SEC7OR Fitness",
  description:
    "Real member transformations at SEC7OR Fitness Kochi. Documented weight loss, muscle gain, and body recomposition results with certified trainers.",
};

interface Transformation {
  name: string;
  duration: string;
  change: string;
  goal: string;
  trainerName: string;
  testimonial: string;
  gradient: string;
}

const TRANSFORMATIONS: Transformation[] = [
  {
    name: "Rahul M.",
    duration: "6 Months",
    change: "−18 kg",
    goal: "Weight Loss",
    trainerName: "Rohit Kumar",
    testimonial:
      "I never thought I'd be able to lose this much weight without starving myself. Rohit's approach to nutrition changed everything for me.",
    gradient: "from-orange-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Priya K.",
    duration: "4 Months",
    change: "+8 kg",
    goal: "Muscle Gain",
    trainerName: "Arjun Menon",
    testimonial:
      "Arjun pushed me harder than I'd ever pushed myself, but always safely. I went from struggling with 40 kg squats to squatting 80 kg.",
    gradient: "from-blue-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Arjun V.",
    duration: "8 Months",
    change: "−22 kg",
    goal: "Body Recomp",
    trainerName: "Rohit Kumar",
    testimonial:
      "22 kg gone but I'm actually stronger than I was before. That's what a proper programme does — it doesn't just make you lighter, it makes you better.",
    gradient: "from-emerald-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Sneha R.",
    duration: "3 Months",
    change: "−10 kg",
    goal: "Weight Loss",
    trainerName: "Sana Thomas",
    testimonial:
      "Sana's functional approach made me realise fitness isn't just about the scale. I can move better, feel better, and yes — I lost 10 kg too.",
    gradient: "from-purple-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Kiran T.",
    duration: "5 Months",
    change: "+12 kg",
    goal: "Muscle Gain",
    trainerName: "Arjun Menon",
    testimonial:
      "I spent 2 years in gyms without real results before SEC7OR. Within 5 months of structured programming with Arjun, I gained 12 kg of muscle.",
    gradient: "from-rose-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Meera J.",
    duration: "5 Months",
    change: "−14 kg",
    goal: "Weight Loss",
    trainerName: "Sana Thomas",
    testimonial:
      "As a working mother of two, Sana designed sessions that fit my schedule and didn't leave me exhausted for the rest of the day. Absolutely life-changing.",
    gradient: "from-teal-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Dev S.",
    duration: "7 Months",
    change: "−20 kg",
    goal: "Weight Loss",
    trainerName: "Rohit Kumar",
    testimonial:
      "Doctor told me to lose weight or face serious health consequences. Rohit took that seriously and built a safe, progressive plan. 20 kg in 7 months.",
    gradient: "from-amber-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Ananya P.",
    duration: "6 Months",
    change: "Body Recomp",
    goal: "CrossFit",
    trainerName: "Priya Nair",
    testimonial:
      "Priya's CrossFit programme changed how I think about fitness. I'm not training for looks anymore — I'm training for performance. And the looks followed anyway.",
    gradient: "from-indigo-950 via-zinc-900 to-zinc-950",
  },
];

const STATS = [
  { value: "3000+", label: "Members Transformed" },
  { value: "92%", label: "Reach Their First Goal" },
  { value: "4.8★", label: "Average Google Rating" },
  { value: "5+", label: "Years of Documented Results" },
];

export default function TransformationsPage() {
  return (
    <>
      <PageHero
        label="Real Results"
        heading="Member <em>Transformations</em>"
        subtitle="No stock photos. No fabricated timelines. Every story below belongs to a real SEC7OR member."
      />

      {/* Social proof strip */}
      <section className="bg-bg-secondary border-b border-border py-10">
        <div className="container-section">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <span className="font-mono text-3xl md:text-4xl font-bold text-white">
                  {s.value}
                </span>
                <span className="font-body text-xs text-muted tracking-widest uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformations grid */}
      <section className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {TRANSFORMATIONS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.05}>
                <article className="card-dark overflow-hidden flex flex-col h-full">
                  {/* Before/After placeholder */}
                  <div
                    className={`bg-gradient-to-b ${t.gradient} relative flex flex-col items-center justify-center`}
                    style={{ aspectRatio: "3/4" }}
                  >
                    <span className="font-body text-[10px] text-white/20 tracking-[0.3em] uppercase mb-2">
                      Before / After
                    </span>
                    <span className="font-display text-2xl text-white/8">Photo</span>
                    <span className="absolute top-4 right-4 bg-accent text-white font-body text-xs font-semibold px-2 py-1 tracking-wider uppercase">
                      {t.goal}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-xl tracking-wide text-white uppercase">
                        {t.name}
                      </span>
                      <span className="font-mono text-lg font-bold text-accent">
                        {t.change}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-body text-xs text-muted">
                      <span>{t.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
                      <span>Coach: {t.trainerName}</span>
                    </div>
                    <blockquote className="font-body text-sm text-white/55 leading-relaxed italic border-l-2 border-accent/40 pl-3 flex-1">
                      &ldquo;{t.testimonial}&rdquo;
                    </blockquote>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

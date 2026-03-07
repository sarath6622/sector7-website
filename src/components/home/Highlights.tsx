import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const STATS = [
  { value: 50,   suffix: "+", label: "Equipment Pieces" },
  { value: 12,   suffix: "+", label: "Expert Trainers"  },
  { value: 3000, suffix: "+", label: "Transformations"  },
  { value: 5,    suffix: "+", label: "Years of Excellence" },
];

/**
 * Highlights — animated stat counters strip between Hero and Facilities.
 * AnimatedCounter is a client component; this wrapper is a Server Component.
 */
export function Highlights() {
  return (
    <section
      className="py-16 md:py-20 bg-bg-secondary border-y border-border"
      aria-label="Gym statistics"
    >
      <div className="container-section">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Transformation {
  name: string;
  duration: string;
  change: string;
  goal: string;
  gradient: string;
}

const TRANSFORMATIONS: Transformation[] = [
  {
    name: "Rahul M.",
    duration: "6 Months",
    change: "−18 kg",
    goal: "Weight Loss",
    gradient: "from-orange-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Priya K.",
    duration: "4 Months",
    change: "+8 kg",
    goal: "Muscle Gain",
    gradient: "from-blue-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Arjun V.",
    duration: "8 Months",
    change: "−22 kg",
    goal: "Body Recomp",
    gradient: "from-emerald-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Sneha R.",
    duration: "3 Months",
    change: "−10 kg",
    goal: "Weight Loss",
    gradient: "from-purple-950 via-zinc-900 to-zinc-950",
  },
  {
    name: "Kiran T.",
    duration: "5 Months",
    change: "+12 kg",
    goal: "Muscle Gain",
    gradient: "from-rose-950 via-zinc-900 to-zinc-950",
  },
];

const CARD_WIDTH = 304; // px + 16px gap

/**
 * TransformationPreview — horizontal scroll carousel of client transformations.
 * Client Component for scroll + button interactivity.
 *
 * The image area is a gradient placeholder — replace with BeforeAfterSlider
 * component and Sanity images in Phase 7 (Transformations page).
 */
export function TransformationPreview() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + 16) : CARD_WIDTH + 16,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-bg-secondary overflow-hidden">
      <div className="container-section flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            label="Real Results"
            heading="Real <em>Transformations</em>"
            subtitle="Our members' journeys — tracked, coached, and celebrated every step."
          />
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => scroll("left")}
              disabled={!canLeft}
              aria-label="Scroll carousel left"
              className="w-10 h-10 flex items-center justify-center border border-border text-white/50 hover:border-accent hover:text-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canRight}
              aria-label="Scroll carousel right"
              className="w-10 h-10 flex items-center justify-center border border-border text-white/50 hover:border-accent hover:text-accent transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          onScroll={updateState}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="list"
          aria-label="Transformation stories"
        >
          {TRANSFORMATIONS.map((t) => (
            <div
              key={t.name}
              role="listitem"
              className="card-dark flex-shrink-0 w-72 snap-start overflow-hidden"
            >
              {/* Image placeholder — replace with BeforeAfterSlider + Sanity images */}
              <div
                className={`bg-gradient-to-b ${t.gradient} relative flex flex-col items-center justify-center`}
                style={{ aspectRatio: "3/4" }}
              >
                <span className="font-body text-[10px] text-white/20 tracking-[0.35em] uppercase mb-2">
                  Before / After
                </span>
                <span className="font-display text-3xl text-white/8 uppercase">
                  Photo
                </span>
                <span className="absolute top-4 right-4 bg-accent text-white font-body text-xs font-semibold px-2 py-1 tracking-wider uppercase">
                  {t.goal}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-xl tracking-wide text-white uppercase">
                    {t.name}
                  </span>
                  <span className="font-mono text-lg font-bold text-accent">
                    {t.change}
                  </span>
                </div>
                <span className="font-body text-xs text-muted tracking-wider">
                  {t.duration}
                </span>
              </div>
            </div>
          ))}

          {/* "See all" card */}
          <Link
            href="/transformations"
            className="card-dark flex-shrink-0 w-72 snap-start flex flex-col items-center justify-center gap-3 group hover:border-accent/50 transition-colors"
            style={{ minHeight: "400px" }}
            aria-label="See all transformations"
          >
            <span className="font-display text-3xl tracking-wide text-white/20 uppercase group-hover:text-accent/60 transition-colors">
              See All
            </span>
            <ArrowRight
              size={22}
              className="text-white/20 group-hover:text-accent/60 group-hover:translate-x-1 transition-all"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

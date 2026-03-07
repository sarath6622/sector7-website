"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** The target number to count up to */
  value: number;
  /** Optional suffix (e.g. "+", "%", "kg") */
  suffix?: string;
  /** Optional prefix (e.g. "#", "$") */
  prefix?: string;
  /** Label below the number */
  label: string;
  /** Duration of the count-up animation in ms (default 1800) */
  duration?: number;
  className?: string;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * AnimatedCounter — counts up from 0 to `value` when scrolled into view.
 * Uses IntersectionObserver; respects prefers-reduced-motion.
 * Number rendered in JetBrains Mono for that techy stat look.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 1800,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (shouldReduce) {
      setCount(value);
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutQuart(progress) * value));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, value, duration, shouldReduce]);

  return (
    <div ref={ref} className={cn("flex flex-col items-center gap-2", className)}>
      <span
        className="font-mono text-5xl sm:text-6xl font-bold text-white leading-none"
        aria-live="polite"
        aria-label={`${prefix}${value}${suffix} ${label}`}
      >
        <span aria-hidden="true">
          {prefix}{count}{suffix}
        </span>
      </span>
      <span className="font-body text-sm text-muted tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

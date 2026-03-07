"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Delay before animation starts in seconds (default 0) */
  delay?: number;
  /** Direction of the reveal (default "up") */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance to travel in px (default 24) */
  distance?: number;
  /** Duration in seconds (default 0.6) */
  duration?: number;
  /** Intersection threshold to trigger (default 0.15) */
  threshold?: number;
  className?: string;
  /** Only animate once (default true) */
  once?: boolean;
}

/**
 * ScrollReveal — wraps children in a Framer Motion element that fades+slides
 * into view when scrolled into the viewport.
 *
 * Respects prefers-reduced-motion: if reduced, children render instantly.
 * Use `delay` to stagger multiple siblings.
 *
 * Example:
 *   <ScrollReveal delay={0.1}><Card /></ScrollReveal>
 *   <ScrollReveal delay={0.2}><Card /></ScrollReveal>
 */
export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 0.6,
  threshold = 0.15,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const offsets: Record<NonNullable<ScrollRevealProps["direction"]>, { x: number; y: number }> = {
    up:    { x: 0, y: distance },
    down:  { x: 0, y: -distance },
    left:  { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none:  { x: 0, y: 0 },
  };

  const { x, y } = offsets[direction];

  const variants: Variants = {
    hidden:  { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useReducedMotion } from "framer-motion";
import { useIntersectionObserver } from "./useIntersectionObserver";
import type { RefObject } from "react";

interface UseScrollRevealReturn {
  ref: RefObject<Element | null>;
  isVisible: boolean;
  shouldAnimate: boolean;
}

/**
 * Combines IntersectionObserver with reduced-motion preference.
 * Use with Framer Motion to build accessible scroll-reveal animations.
 *
 * @returns { ref, isVisible, shouldAnimate }
 * - ref: attach to the element you want to observe
 * - isVisible: true when element enters viewport
 * - shouldAnimate: false if user prefers reduced motion
 */
export function useScrollReveal(): UseScrollRevealReturn {
  const prefersReducedMotion = useReducedMotion();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return {
    ref,
    isVisible,
    shouldAnimate: !prefersReducedMotion,
  };
}

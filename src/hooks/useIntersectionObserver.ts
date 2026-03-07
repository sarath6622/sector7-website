"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Returns whether an element has entered the viewport.
 * Used by AnimatedCounter and ScrollReveal components.
 *
 * @param options - IntersectionObserver options + freezeOnceVisible
 * @returns [ref, isIntersecting]
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<Element | null>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = "0px", freezeOnceVisible = true } = options;
  const ref = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setIsIntersecting(visible);
        if (visible && freezeOnceVisible) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [ref, isIntersecting];
}

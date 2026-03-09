"use client";

import { useScroll, useSpring, motion } from "framer-motion";

/**
 * ScrollProgress — thin accent bar at the very top of the viewport.
 * Fills left-to-right as the user scrolls down the page.
 * Uses Framer Motion useSpring for a smooth, physics-based feel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

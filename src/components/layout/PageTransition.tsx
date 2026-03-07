"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps page content with a subtle fade-in transition.
 * Respects prefers-reduced-motion — no animation when set.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

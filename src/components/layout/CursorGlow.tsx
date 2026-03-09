"use client";

import { useEffect, useRef } from "react";

/**
 * CursorGlow — soft radial orange glow that lazily follows the cursor.
 * Desktop only (hidden on touch/mobile). pointer-events: none so it
 * never blocks interactions. Uses rAF + lerp for a smooth trailing feel.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const pos   = useRef({ x: -1000, y: -1000 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.1);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.1);

      if (ref.current) {
        ref.current.style.background =
          `radial-gradient(650px circle at ${pos.current.x}px ${pos.current.y}px, rgba(255,85,0,0.07) 0%, transparent 70%)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[30] hidden md:block"
      aria-hidden="true"
    />
  );
}

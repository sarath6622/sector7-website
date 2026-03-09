"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  /** Alt prefix — "Name — before" / "Name — after" appended automatically */
  name: string;
  sizes?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  name,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // 0–100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // ── helpers ──────────────────────────────────────────────────────────────────
  const clamp = (v: number) => Math.max(2, Math.min(98, v));

  const posFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }, []);

  // ── mouse ────────────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPosition(posFromClientX(e.clientX));
    },
    [posFromClientX]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── touch ────────────────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    setPosition(posFromClientX(e.touches[0].clientX));
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault(); // stop page scroll while dragging
      setPosition(posFromClientX(e.touches[0].clientX));
    },
    [posFromClientX]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── keyboard ─────────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => clamp(p - 2));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => clamp(p + 2));
    }
  };

  // ── global event listeners (attached once, cleaned up on unmount) ─────────────
  useEffect(() => {
    const container = containerRef.current;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container?.addEventListener("touchmove", handleTouchMove, { passive: false });
    container?.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container?.removeEventListener("touchmove", handleTouchMove);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden"
      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-label={`Before and after comparison for ${name}`}
    >
      {/* ── Before image (full, underneath) ──────────────────────────────────── */}
      <Image
        src={beforeUrl}
        alt={`${name} — before`}
        fill
        className="object-cover pointer-events-none"
        sizes={sizes}
        priority={false}
      />

      {/* ── "BEFORE" label ────────────────────────────────────────────────────── */}
      <span
        className="absolute bottom-3 left-3 font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 bg-black/50 px-2 py-0.5 pointer-events-none z-10"
        aria-hidden="true"
      >
        Before
      </span>

      {/* ── After image (clipped from the left) ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={afterUrl}
          alt={`${name} — after`}
          fill
          className="object-cover"
          sizes={sizes}
          priority={false}
        />
        {/* ── "AFTER" label ───────────────────────────────────────────────────── */}
        <span
          className="absolute bottom-3 right-3 font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 bg-black/50 px-2 py-0.5"
          aria-hidden="true"
        >
          After
        </span>
      </div>

      {/* ── Divider line ─────────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 pointer-events-none z-20"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        aria-hidden="true"
      />

      {/* ── Drag handle ──────────────────────────────────────────────────────── */}
      <div
        className="absolute top-1/2 z-20 flex items-center justify-center rounded-full bg-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: 44,
          height: 44,
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-label={`Drag to compare before and after for ${name}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Left + right chevron arrows */}
        <svg
          width="22"
          height="14"
          viewBox="0 0 22 14"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none"
        >
          <path
            d="M6 1L1 7L6 13"
            stroke="#0A0A0A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 1L21 7L16 13"
            stroke="#0A0A0A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

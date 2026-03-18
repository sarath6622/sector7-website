"use client";

import { useState } from "react";

const DARK_FILTER = "grayscale(1) brightness(0.4) contrast(1.1) invert(0.92) hue-rotate(200deg)";

export function DarkMapEmbed({ src }: { src: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative border border-border overflow-hidden rounded-sm"
      style={{ height: "300px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-full h-full"
        style={{
          filter: hovered ? "none" : DARK_FILTER,
          transition: "filter 0.5s ease",
        }}
      >
        <iframe
          src={src}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SEC7OR Fitness on Google Maps"
        />
      </div>
      {/* Accent border glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none rounded-sm"
        style={{
          border: hovered ? "1px solid rgba(255, 85, 0, 0.3)" : "1px solid transparent",
          transition: "border-color 0.5s ease",
        }}
      />
      {/* Subtle gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(12, 12, 12, 0.6), transparent)",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface GalleryImage {
  url: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  /** CSS gradient string — used as placeholder when no images */
  gradient?: string;
  zoneName?: string;
  sizes?: string;
}

export function ImageGallery({
  images,
  gradient,
  zoneName = "Zone",
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Lightbox navigation ───────────────────────────────────────────────────
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevLight = useCallback(
    () => setLightboxIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  const nextLight = useCallback(
    () => setLightboxIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  // ── Keyboard control ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") prevLight();
      else if (e.key === "ArrowRight") nextLight();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, prevLight, nextLight]);

  // ── Scroll lock when lightbox is open ────────────────────────────────────
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  // ── Touch swipe for lightbox ──────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? nextLight() : prevLight();
    }
    touchStartX.current = null;
  };

  // ── No images — gradient placeholder ─────────────────────────────────────
  if (!images.length) {
    return (
      <div
        className="relative overflow-hidden border border-border"
        style={{ aspectRatio: "4/3", background: gradient }}
      >
        <div className="absolute inset-0 flex items-end p-8">
          <span className="font-display text-4xl text-white/10 uppercase tracking-widest">
            {zoneName}
          </span>
        </div>
      </div>
    );
  }

  // ── Single image — no gallery chrome ──────────────────────────────────────
  if (images.length === 1) {
    return (
      <div
        className="relative overflow-hidden border border-border group cursor-pointer"
        style={{ aspectRatio: "4/3" }}
        onClick={() => openLightbox(0)}
        role="button"
        aria-label={`View ${zoneName} photo fullscreen`}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openLightbox(0)}
      >
        <Image
          src={images[0].url}
          alt={images[0].alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={sizes}
        />
        {/* Expand hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-full p-3">
            <Expand size={20} className="text-white" />
          </div>
        </div>
        {mounted && lightboxOpen && createPortal(
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevLight}
            onNext={nextLight}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />,
          document.body
        )}
      </div>
    );
  }

  // ── Multiple images — main + thumbnail strip ───────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative overflow-hidden border border-border group cursor-pointer"
        style={{ aspectRatio: "4/3" }}
        onClick={() => openLightbox(activeIndex)}
        role="button"
        aria-label={`View ${zoneName} photo fullscreen`}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openLightbox(activeIndex)}
      >
        <Image
          key={images[activeIndex].url}
          src={images[activeIndex].url}
          alt={images[activeIndex].alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={sizes}
        />
        {/* Photo count badge */}
        <span className="absolute bottom-3 left-3 bg-black/60 font-body text-xs text-white/80 px-2 py-1 tracking-wider">
          {activeIndex + 1} / {images.length}
        </span>
        {/* Expand hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-full p-3">
            <Expand size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div
        ref={thumbnailRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        aria-label={`${zoneName} photo thumbnails`}
      >
        {images.map((img, i) => (
          <button
            key={img.url}
            onClick={() => setActiveIndex(i)}
            className={`relative flex-shrink-0 overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              i === activeIndex
                ? "border-accent"
                : "border-border hover:border-white/40"
            }`}
            style={{ width: 64, height: 48 }}
            aria-label={`View photo ${i + 1} of ${images.length}`}
            aria-pressed={i === activeIndex}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Lightbox portal */}
      {mounted && lightboxOpen && createPortal(
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLight}
          onNext={nextLight}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />,
        document.body
      )}
    </div>
  );
}

// ── Lightbox overlay ──────────────────────────────────────────────────────────
interface LightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

function Lightbox({ images, index, onClose, onPrev, onNext, onTouchStart, onTouchEnd }: LightboxProps) {
  const hasMultiple = images.length > 1;

  return (
    <AnimatePresence>
      {/* Backdrop — clicking here closes the lightbox */}
      <motion.div
        key="lightbox-backdrop"
        className="fixed inset-0 z-[100] bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-modal="true"
        role="dialog"
        aria-label="Photo lightbox"
      />

      {/* Image panel — centered, narrower than viewport so controls are clear */}
      <motion.div
        key={`panel-${index}`}
        className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="relative pointer-events-auto"
          style={{ width: "min(90vw, 900px)", height: "min(85vh, 675px)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[index].url}
            alt={images[index].alt}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>
      </motion.div>

      {/* Controls layer — always on top, pointer-events-none container so backdrop clicks work in gaps */}
      <div className="fixed inset-0 z-[102] pointer-events-none" key="lightbox-controls">
        {/* Close */}
        <button
          className="pointer-events-auto absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close lightbox"
        >
          <X size={22} />
        </button>

        {/* Counter */}
        {hasMultiple && (
          <span className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-xs text-white/60 tracking-widest select-none">
            {index + 1} / {images.length}
          </span>
        )}

        {/* Prev / Next */}
        {hasMultiple && (
          <>
            <button
              className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>
    </AnimatePresence>
  );
}

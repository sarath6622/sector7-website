"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative number */}
      <div
        className="font-display text-[180px] md:text-[260px] leading-none text-white/[0.03] select-none"
        aria-hidden="true"
      >
        404
      </div>

      <div className="-mt-8 md:-mt-16 flex flex-col items-center gap-6">
        <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent">
          Page Not Found
        </span>

        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-white uppercase leading-none">
          This page<br />
          doesn&apos;t <em className="not-italic text-accent">exist</em>
        </h1>

        <p className="font-body text-sm text-muted max-w-xs leading-relaxed">
          The page you&apos;re looking for may have moved or never existed.
          Head back to the homepage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="primary" href="/">
            <Home size={14} />
            Go Home
          </Button>
          <Button variant="ghost" href="/contact">
            <ArrowLeft size={14} />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}

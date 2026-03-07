"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to error reporting service in Phase 10
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative */}
      <div
        className="font-display text-[180px] md:text-[260px] leading-none text-white/[0.03] select-none"
        aria-hidden="true"
      >
        500
      </div>

      <div className="-mt-8 md:-mt-16 flex flex-col items-center gap-6">
        <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent">
          Something Went Wrong
        </span>

        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-white uppercase leading-none">
          Unexpected<br />
          <em className="not-italic text-accent">Error</em>
        </h1>

        <p className="font-body text-sm text-muted max-w-xs leading-relaxed">
          Something broke on our end. Try refreshing — if it keeps happening, give us a call.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={reset}>
            <RefreshCw size={14} />
            Try Again
          </Button>
          <Button variant="ghost" href="/">
            <Home size={14} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

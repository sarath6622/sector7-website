import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface SkeletonProps {
  className?: string;
  /** Shape variant (default "rect") */
  variant?: "rect" | "circle" | "text";
  /** Number of text-line skeletons to render (only used when variant="text") */
  lines?: number;
}

/**
 * Skeleton — shimmer loading placeholder for async content.
 *
 * Usage:
 *   // Single block
 *   <Skeleton className="w-full h-48" />
 *
 *   // Avatar + text lines
 *   <div className="flex gap-3">
 *     <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
 *     <Skeleton variant="text" lines={3} className="flex-1" />
 *   </div>
 */
export function Skeleton({ className, variant = "rect", lines = 3 }: SkeletonProps) {
  const shimmer =
    "animate-pulse bg-surface relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_1.8s_infinite]";

  if (variant === "circle") {
    return (
      <div
        aria-hidden="true"
        className={cn(shimmer, "rounded-full bg-surface", className)}
      />
    );
  }

  if (variant === "text") {
    return (
      <div aria-hidden="true" className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              shimmer,
              "h-4 rounded",
              i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(shimmer, "rounded", className)}
    />
  );
}

/* ─── Composite skeletons ──────────────────────────────────────────────────── */

/**
 * Thin branded bar shown at the very top of every loading screen.
 * Matches the accent colour so it feels intentional, not broken.
 */
function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-surface overflow-hidden">
      <div
        className="h-full w-1/3 bg-accent"
        style={{ animation: "loading-bar 1.4s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton for PageHero — label chip + two heading lines + subtitle.
 * Matches the real PageHero component proportions.
 */
export function PageHeroSkeleton() {
  return (
    <div className="bg-bg-secondary pt-32 pb-20 md:pb-28">
      <div className="container-section flex flex-col gap-4 max-w-3xl">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-16 w-1/2" />
        <div className="flex flex-col gap-2 mt-1">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </div>
      </div>
    </div>
  );
}

/** 3-column card grid skeleton — used by Trainers, Blog, Transformations. */
export function CardGridSkeleton({ count = 6, imageHeight = "h-56" }: { count?: number; imageHeight?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className={cn(imageHeight, "w-full")} />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full-page loading shell — branded logo + orange sweep bar.
 * Wraps any page-level loading state.
 */
export function PageLoadingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingBar />
      {/* Ghost navbar so layout doesn't shift */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-16 md:h-20 bg-bg-primary/95 backdrop-blur-md flex items-center px-4 md:px-8 lg:px-16">
        <Logo variant="compact" className="text-2xl md:text-3xl opacity-70" />
      </div>
      <div aria-busy="true" aria-label="Loading page content">
        {children}
      </div>
    </>
  );
}

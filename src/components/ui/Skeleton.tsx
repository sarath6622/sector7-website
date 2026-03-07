import { cn } from "@/lib/utils";

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

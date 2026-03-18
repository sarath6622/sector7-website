import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * compact — smaller logo for Navbar
   * full    — larger logo for Footer / hero
   */
  variant?: "compact" | "full";
  className?: string;
}

/**
 * SEC7OR FITNESS logo — renders the actual brand PNG.
 */
export function Logo({ variant = "full", className }: LogoProps) {
  const isCompact = variant === "compact";

  return (
    <Image
      src="/images/logo.png"
      alt="SEC7OR Fitness"
      width={isCompact ? 120 : 180}
      height={isCompact ? 40 : 60}
      className={cn("object-contain", className)}
      priority
    />
  );
}

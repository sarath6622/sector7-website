import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely (handles conflicts).
 * Usage: cn("px-4 py-2", condition && "bg-red-500", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format.
 * e.g. "2024-01-15" → "January 15, 2024"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate estimated read time for a given word count.
 * Assumes 200 words per minute reading speed.
 */
export function estimateReadTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

/**
 * Truncate text to a given character limit with ellipsis.
 */
export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "…";
}

/**
 * Convert weight change number to display string.
 * e.g. -18 → "-18 kg", 8 → "+8 kg"
 */
export function formatWeightChange(kg: number): string {
  return kg >= 0 ? `+${kg} kg` : `${kg} kg`;
}

/**
 * Get day of week index (0 = Sunday) and check if gym is open today.
 */
export function getTodayDayName(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()] ?? "Monday";
}

import type { ReadinessLevel } from "@/data/visaReadiness";

// Colour is used only for small dots and badges; cards stay neutral.
export const levelDot: Record<ReadinessLevel, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export const levelBadge: Record<ReadinessLevel, string> = {
  high: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
  medium: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  low: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
};

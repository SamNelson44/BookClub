import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type BadgeVariant = "finished" | "genre" | "host" | "member" | "idea" | "current" | "completed";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  finished:  "bg-sage text-parchment",
  genre:     "", // handled dynamically
  host:      "bg-sage-100 text-sage-700 dark:bg-stone-800 dark:text-stone-300",
  member:    "bg-parchment text-coffee/60 border border-sage-100 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-700",
  idea:      "bg-coffee-50 text-coffee dark:bg-stone-800 dark:text-stone-300",
  current:   "bg-sage text-parchment",
  completed: "bg-sage-100 text-sage-700 dark:bg-stone-800 dark:text-stone-300",
};

const defaultLabels: Partial<Record<BadgeVariant, string>> = {
  finished:  "Finished!",
  host:      "Host",
  member:    "Member",
  idea:      "Idea",
  current:   "Reading now",
  completed: "Completed",
};

// A palette of [lightClasses, darkClasses] pairs for genre badges.
// Each genre name hashes to one slot, so the same genre always gets the same color.
const GENRE_PALETTE: [string, string][] = [
  ["bg-violet-100 text-violet-800",   "dark:bg-violet-900/40 dark:text-violet-300"],
  ["bg-sky-100 text-sky-800",         "dark:bg-sky-900/40 dark:text-sky-300"],
  ["bg-amber-100 text-amber-800",     "dark:bg-amber-900/40 dark:text-amber-300"],
  ["bg-rose-100 text-rose-800",       "dark:bg-rose-900/40 dark:text-rose-300"],
  ["bg-emerald-100 text-emerald-800", "dark:bg-emerald-900/40 dark:text-emerald-300"],
  ["bg-orange-100 text-orange-800",   "dark:bg-orange-900/40 dark:text-orange-300"],
  ["bg-indigo-100 text-indigo-800",   "dark:bg-indigo-900/40 dark:text-indigo-300"],
  ["bg-teal-100 text-teal-800",       "dark:bg-teal-900/40 dark:text-teal-300"],
  ["bg-pink-100 text-pink-800",       "dark:bg-pink-900/40 dark:text-pink-300"],
  ["bg-lime-100 text-lime-800",       "dark:bg-lime-900/40 dark:text-lime-300"],
];

function genreColorClasses(genre: string): string {
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = (hash * 31 + genre.charCodeAt(i)) >>> 0;
  }
  const [light, dark] = GENRE_PALETTE[hash % GENRE_PALETTE.length];
  return `${light} ${dark}`;
}

export function Badge({ variant, label, className }: BadgeProps) {
  const text = label ?? defaultLabels[variant] ?? variant;
  const dynamicClass = variant === "genre" ? genreColorClasses(text) : variantClasses[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        dynamicClass,
        className
      )}
    >
      {variant === "finished" && <Check className="w-3 h-3" />}
      {text}
    </span>
  );
}

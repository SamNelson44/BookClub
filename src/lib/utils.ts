/** Merge class names (lightweight, no external dep). */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format an ISO date string to a human-readable short date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Calculate reading progress as a 0–100 number. */
export function calcProgressPercent(
  currentPage: number,
  pageCount: number
): number {
  if (pageCount <= 0) return 0;
  return Math.min(100, Math.round((currentPage / pageCount) * 100));
}

/** Return initials from a name string (up to 2 chars). */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

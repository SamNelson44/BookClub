interface ProgressBarProps {
  value: number; // 0–100
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({ value, showLabel = false, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className={`flex-1 ${height} bg-sage-50 dark:bg-stone-700 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-sage rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-coffee/60 dark:text-stone-400 w-9 text-right tabular-nums flex-shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
}

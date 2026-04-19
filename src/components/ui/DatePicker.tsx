"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { CalendarDays, X } from "lucide-react";

interface DatePickerProps {
  name: string;
  defaultValue?: string | null; // "YYYY-MM-DD"
  placeholder?: string;
}

function toLocalDate(iso: string): Date {
  // Parse YYYY-MM-DD without timezone shift
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIsoString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DatePicker({
  name,
  defaultValue,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(
    defaultValue ? toLocalDate(defaultValue) : undefined
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formattedLabel = selected
    ? selected.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div ref={ref} className="relative">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selected ? toIsoString(selected) : ""} />

      {/* Trigger button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex-1 flex items-center gap-2 border rounded-xl px-3 py-2 text-sm text-left transition-colors focus:outline-none focus:ring-2 focus:ring-sage/40
            ${selected
              ? "border-sage-200 dark:border-stone-600 text-coffee dark:text-stone-100 bg-white dark:bg-stone-800"
              : "border-sage-200 dark:border-stone-600 text-coffee/40 dark:text-stone-500 bg-white dark:bg-stone-800"
            }`}
        >
          <CalendarDays className="w-4 h-4 text-sage flex-shrink-0" />
          <span className="flex-1">{formattedLabel ?? placeholder}</span>
        </button>
        {selected && (
          <button
            type="button"
            onClick={() => setSelected(undefined)}
            className="text-coffee/40 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-300 transition-colors p-1"
            aria-label="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-stone-900 border border-sage-100 dark:border-stone-700 rounded-cozy shadow-cozy-md p-3">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              setSelected(date);
              setOpen(false);
            }}
            classNames={{
              root: "text-coffee dark:text-stone-100",
              months: "flex flex-col",
              month: "space-y-3",
              month_caption: "flex items-center justify-between px-1 mb-1",
              caption_label: "font-serif text-base text-coffee dark:text-stone-100",
              nav: "flex items-center gap-1",
              button_previous:
                "w-7 h-7 flex items-center justify-center rounded-lg text-coffee/50 dark:text-stone-400 hover:bg-sage-50 dark:hover:bg-stone-800 hover:text-coffee dark:hover:text-stone-200 transition-colors",
              button_next:
                "w-7 h-7 flex items-center justify-center rounded-lg text-coffee/50 dark:text-stone-400 hover:bg-sage-50 dark:hover:bg-stone-800 hover:text-coffee dark:hover:text-stone-200 transition-colors",
              month_grid: "w-full border-collapse",
              weekdays: "flex mb-1",
              weekday:
                "flex-1 text-center text-xs font-medium text-coffee/40 dark:text-stone-500 py-1",
              week: "flex",
              day: "flex-1 p-0.5",
              day_button:
                "w-full aspect-square flex items-center justify-center text-sm rounded-lg transition-colors hover:bg-sage-50 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-sage/40",
              selected:
                "[&>button]:bg-sage [&>button]:text-parchment [&>button]:hover:bg-sage-700",
              today: "[&>button]:font-bold [&>button]:text-sage",
              outside: "[&>button]:text-coffee/25 dark:[&>button]:text-stone-600",
              disabled: "[&>button]:text-coffee/20 dark:[&>button]:text-stone-700 [&>button]:cursor-not-allowed",
            }}
          />
        </div>
      )}
    </div>
  );
}

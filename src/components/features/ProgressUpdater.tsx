"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { updateProgress } from "@/actions/progress";

interface ProgressUpdaterProps {
  bookId: string;
  pageCount: number;
  currentPage: number;
}

export function ProgressUpdater({ bookId, pageCount, currentPage }: ProgressUpdaterProps) {
  const [page, setPage] = useState(currentPage);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const isFinished = page >= pageCount;
  const percent = pageCount > 0 ? Math.round((page / pageCount) * 100) : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    startTransition(async () => {
      await updateProgress(bookId, page);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-coffee dark:text-stone-200" htmlFor="page-slider">
          Your progress
        </label>
        <div className="flex items-center gap-2">
          {isFinished && <Badge variant="finished" />}
          <span className="text-sm text-coffee/60 dark:text-stone-400 tabular-nums">
            {page} / {pageCount} pages
          </span>
        </div>
      </div>

      <input
        id="page-slider"
        type="range"
        min={0}
        max={pageCount}
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
        className="w-full accent-sage cursor-pointer"
      />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="number"
            min={0}
            max={pageCount}
            value={page}
            onChange={(e) => setPage(Math.min(pageCount, Math.max(0, Number(e.target.value))))}
            className="w-24 border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2 text-sm text-coffee dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800 tabular-nums"
          />
          <span className="text-sm text-coffee/60 dark:text-stone-400">
            of {pageCount} pages ({percent}%)
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-sage text-parchment rounded-xl px-4 py-2 text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isPending ? "Saving…" : saved ? "Saved!" : "Update"}
        </button>
      </div>
    </form>
  );
}

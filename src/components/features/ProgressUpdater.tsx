"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { updateProgressAction } from "@/actions/progress";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-sage text-parchment rounded-xl px-4 py-2 text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-60 flex items-center gap-2"
    >
      {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {pending ? "Saving…" : "Update"}
    </button>
  );
}

interface ProgressUpdaterProps {
  bookId: string;
  pageCount: number;
  currentPage: number;
}

export function ProgressUpdater({ bookId, pageCount, currentPage }: ProgressUpdaterProps) {
  const [page, setPage] = useState(currentPage);

  const isFinished = page >= pageCount;
  const percent = pageCount > 0 ? Math.round((page / pageCount) * 100) : 0;

  return (
    <form action={updateProgressAction} className="space-y-4">
      <input type="hidden" name="bookId" value={bookId} />

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
            name="page"
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
        <SubmitButton />
      </div>
    </form>
  );
}

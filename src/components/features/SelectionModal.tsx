"use client";

import { useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Shuffle, Trophy, X, Loader2 } from "lucide-react";
import { selectBookFormAction } from "@/actions/books";
import type { IdeaPoolBook } from "@/lib/types";

interface SelectionModalProps {
  books: IdeaPoolBook[];
}

function SelectButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-start gap-3 bg-white dark:bg-stone-800 border border-sage-100 dark:border-stone-700 rounded-cozy p-4 hover:border-sage hover:shadow-cozy text-left transition-all disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function SelectionModal({ books }: SelectionModalProps) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const topVoted = [...books].sort((a, b) => b.vote_count - a.vote_count)[0];

  useEffect(() => {
    if (!open) return;
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (books.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-coffee dark:bg-stone-700 text-parchment dark:text-stone-100 rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-cozy"
      >
        <Trophy className="w-4 h-4" />
        Select next book
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-coffee/20 dark:bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={modalRef}
            className="relative bg-parchment dark:bg-stone-900 rounded-3xl shadow-cozy-md p-8 w-full max-w-sm animate-fade-in border border-transparent dark:border-stone-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selection-modal-title"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-coffee/40 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 id="selection-modal-title" className="text-xl font-serif text-coffee dark:text-stone-100 mb-2">
              Select the next read
            </h2>
            <p className="text-sm text-coffee/60 dark:text-stone-400 mb-6">
              Choose how to pick the next book for the club.
            </p>

            <div className="space-y-3">
              {topVoted && (
                <form action={selectBookFormAction}>
                  <input type="hidden" name="method" value="top_voted" />
                  <input type="hidden" name="bookId" value={topVoted.id} />
                  <SelectButton>
                    <Trophy className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-coffee dark:text-stone-100 text-sm">Top Voted</p>
                      <p className="text-xs text-coffee/60 dark:text-stone-400 mt-0.5">
                        Pick &ldquo;{topVoted.title}&rdquo; — {topVoted.vote_count} vote
                        {topVoted.vote_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </SelectButton>
                </form>
              )}

              <form action={selectBookFormAction}>
                <input type="hidden" name="method" value="pick" />
                <SelectButton>
                  <Shuffle className="w-5 h-5 text-coffee-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-coffee dark:text-stone-100 text-sm">Random Pick</p>
                    <p className="text-xs text-coffee/60 dark:text-stone-400 mt-0.5">
                      Randomly select from all {books.length} idea{books.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </SelectButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

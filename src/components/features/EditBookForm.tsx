"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, X, Loader2 } from "lucide-react";
import { editBook } from "@/actions/books";
import type { Book } from "@/lib/types";

const genres = [
  "Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy",
  "Romance", "Historical", "Biography", "Self-Help", "Poetry", "Other",
];

const inputClass =
  "w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-sm text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-sage text-parchment rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function EditBookForm({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(editBook, null);

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs text-coffee/40 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-300 transition-colors"
        aria-label="Edit book"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-coffee/20 dark:bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`edit-book-title-${book.id}`}
            className="relative bg-parchment dark:bg-stone-900 rounded-3xl shadow-cozy-md border border-transparent dark:border-stone-800 p-6 w-full max-w-lg animate-fade-in overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id={`edit-book-title-${book.id}`} className="text-lg font-serif text-coffee dark:text-stone-100">
                Edit book
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-coffee/40 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {state?.error && (
              <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="bookId" value={book.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor={`title-${book.id}`}>Title *</label>
                  <input id={`title-${book.id}`} name="title" type="text" required defaultValue={book.title} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor={`author-${book.id}`}>Author *</label>
                  <input id={`author-${book.id}`} name="author" type="text" required defaultValue={book.author} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor={`genre-${book.id}`}>Genre</label>
                  <select id={`genre-${book.id}`} name="genre" defaultValue={book.genre ?? ""} className={inputClass}>
                    <option value="">No genre</option>
                    {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor={`page_count-${book.id}`}>Pages *</label>
                  <input id={`page_count-${book.id}`} name="page_count" type="number" required min={1} defaultValue={book.page_count} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor={`description-${book.id}`}>Why this book?</label>
                <textarea
                  id={`description-${book.id}`} name="description" rows={3}
                  defaultValue={book.description ?? ""}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor={`cover_url-${book.id}`}>Cover image URL</label>
                <input id={`cover_url-${book.id}`} name="cover_url" type="url" defaultValue={book.cover_url ?? ""} placeholder="https://…" className={inputClass} />
              </div>

              <div className="flex gap-3 pt-1">
                <SaveButton />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-coffee dark:text-stone-300 hover:bg-sage-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { addBook } from "@/actions/books";

const genres = [
  "Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy",
  "Romance", "Historical", "Biography", "Self-Help", "Poetry", "Other",
];

const inputClass =
  "w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-sm text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800";

export function AddBookForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const result = await addBook(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        form.reset();
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-sage text-parchment rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-sage-700 transition-colors shadow-cozy"
      >
        <Plus className="w-4 h-4" />
        Suggest a book
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy-md border border-sage-100 dark:border-stone-800 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-serif text-coffee dark:text-stone-100">Suggest a book</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-coffee/40 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-200 transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="title">Title *</label>
            <input id="title" name="title" type="text" required placeholder="Book title" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="author">Author *</label>
            <input id="author" name="author" type="text" required placeholder="Author name" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="genre">Genre</label>
            <select id="genre" name="genre" className={inputClass}>
              <option value="">Select genre…</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="page_count">Page count *</label>
            <input id="page_count" name="page_count" type="number" required min={1} placeholder="e.g. 320" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="description">Why this book?</label>
          <textarea
            id="description" name="description" rows={3}
            placeholder="Tell the group why you'd like to read this…"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="cover_url">Cover image URL (optional)</label>
          <input id="cover_url" name="cover_url" type="url" placeholder="https://…" className={inputClass} />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-sage text-parchment rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Adding…" : "Add to Idea Pool"}
          </button>
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
  );
}

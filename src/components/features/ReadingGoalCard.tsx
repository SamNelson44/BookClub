"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarDays, Pencil, X, Check, Loader2 } from "lucide-react";
import { setReadingGoalAction } from "@/actions/books";
import { DatePicker } from "@/components/ui/DatePicker";

interface ReadingGoalCardProps {
  bookId: string;
  pageCount: number;
  goalPage: number | null;
  goalDate: string | null;
  currentPage: number;
  isHost: boolean;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 bg-sage text-parchment rounded-xl px-4 py-2 text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function ReadingGoalCard({
  bookId,
  pageCount,
  goalPage,
  goalDate,
  currentPage,
  isHost,
}: ReadingGoalCardProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(setReadingGoalAction, null);

  useEffect(() => {
    if (state?.success) setEditing(false);
  }, [state]);

  const hasGoal = goalPage !== null;

  const formattedDate = goalDate
    ? new Date(goalDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  const pagesLeft = hasGoal ? goalPage - currentPage : null;
  const goalReached = pagesLeft !== null && pagesLeft <= 0;

  const currentPct = Math.min((currentPage / pageCount) * 100, 100);
  const goalPct = Math.min((goalPage! / pageCount) * 100, 100);

  if (!hasGoal && !isHost) return null;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-sage" />
          <h2 className="font-serif text-lg text-coffee dark:text-stone-100">Weekly Goal</h2>
        </div>
        {isHost && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-coffee/50 dark:text-stone-400 hover:text-coffee dark:hover:text-stone-200 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            {hasGoal ? "Edit" : "Set goal"}
          </button>
        )}
        {isHost && editing && (
          <button
            onClick={() => setEditing(false)}
            className="text-coffee/50 dark:text-stone-400 hover:text-coffee dark:hover:text-stone-200 transition-colors"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {editing ? (
        /* ── Edit form ── */
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="bookId" value={bookId} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5">
                Goal page
                <span className="ml-1 text-coffee/50 dark:text-stone-400 font-normal">
                  (out of {pageCount.toLocaleString()})
                </span>
              </label>
              <input
                type="number"
                name="goalPage"
                min={1}
                max={pageCount}
                defaultValue={goalPage ?? ""}
                placeholder="e.g. 150"
                className="w-full border border-sage-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-coffee dark:text-stone-100 placeholder:text-coffee/30 dark:placeholder:text-stone-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5">
                Meeting date
                <span className="ml-1 text-coffee/50 dark:text-stone-400 font-normal">(optional)</span>
              </label>
              <DatePicker name="goalDate" defaultValue={goalDate} placeholder="Pick a date" />
            </div>
          </div>
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <div className="flex items-center gap-3">
            <SaveButton />
            {hasGoal && (
              <button
                type="submit"
                name="goalPage"
                value=""
                className="text-sm text-coffee/50 dark:text-stone-400 hover:text-coffee dark:hover:text-stone-200 transition-colors"
              >
                Clear goal
              </button>
            )}
          </div>
        </form>
      ) : hasGoal ? (
        /* ── Goal display ── */
        <div className="space-y-4">
          {/* Goal callout */}
          <div className="bg-sage-50 dark:bg-stone-800 rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-coffee/60 dark:text-stone-400 mb-0.5">This week's target</p>
              <p className="font-serif text-xl text-coffee dark:text-stone-100">
                Page {goalPage!.toLocaleString()}
              </p>
            </div>
            {formattedDate && (
              <div className="text-right">
                <p className="text-xs text-coffee/60 dark:text-stone-400 mb-0.5">Meeting</p>
                <p className="text-sm font-medium text-coffee dark:text-stone-200">{formattedDate}</p>
              </div>
            )}
          </div>

          {/* Progress vs goal */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-coffee/70 dark:text-stone-400">Your progress</span>
              {goalReached ? (
                <span className="text-sage font-medium">Goal reached!</span>
              ) : (
                <span className="text-coffee/60 dark:text-stone-400 tabular-nums">
                  {pagesLeft} pages to go
                </span>
              )}
            </div>

            {/* Bar with goal marker */}
            <div className="relative h-3 bg-sage-50 dark:bg-stone-700 rounded-full overflow-visible">
              {/* Current progress fill */}
              <div
                className="absolute inset-y-0 left-0 bg-sage rounded-full transition-all duration-500"
                style={{ width: `${currentPct}%` }}
              />
              {/* Goal marker line */}
              {!goalReached && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-coffee/30 dark:bg-stone-400 rounded-full z-10"
                  style={{ left: `calc(${goalPct}% - 1px)` }}
                />
              )}
            </div>

            {/* Bar labels */}
            <div className="flex justify-between text-xs text-coffee/50 dark:text-stone-500 mt-1.5 tabular-nums">
              <span>p. 0</span>
              <span>Goal: p. {goalPage!.toLocaleString()}</span>
              <span>p. {pageCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        /* ── No goal yet (host only sees this) ── */
        <p className="text-sm text-coffee/60 dark:text-stone-400">
          No goal set yet — click <span className="font-medium text-coffee/80 dark:text-stone-300">"Set goal"</span> to add a weekly page target for the group.
        </p>
      )}
    </div>
  );
}

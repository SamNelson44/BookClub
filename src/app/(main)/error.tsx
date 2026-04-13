"use client";

import { useEffect } from "react";
import { Coffee } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-50 dark:bg-stone-800 rounded-full mb-4">
        <Coffee className="w-8 h-8 text-coffee-200 dark:text-stone-500" />
      </div>
      <h2 className="text-xl font-serif text-coffee dark:text-stone-100 mb-2">Something spilled!</h2>
      <p className="text-coffee/60 dark:text-stone-400 text-sm max-w-xs mb-6">
        An unexpected error occurred. Try refreshing your cup—er, page.
      </p>
      <button
        onClick={reset}
        className="bg-sage text-parchment rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-sage-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

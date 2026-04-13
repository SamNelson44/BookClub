"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleVote } from "@/actions/votes";
import { cn } from "@/lib/utils";

interface VotingPanelProps {
  bookId: string;
  voteCount: number;
  userHasVoted: boolean;
}

export function VotingPanel({ bookId, voteCount, userHasVoted }: VotingPanelProps) {
  const [voted, setVoted] = useState(userHasVoted);
  const [count, setCount] = useState(voteCount);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    // Optimistic update
    const newVoted = !voted;
    setVoted(newVoted);
    setCount((c) => (newVoted ? c + 1 : c - 1));

    startTransition(async () => {
      const result = await toggleVote(bookId);
      if (result?.error) {
        // Revert on error
        setVoted(voted);
        setCount(voteCount);
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-1.5 text-sm transition-colors",
        voted
          ? "text-sage"
          : "text-coffee/40 hover:text-coffee/70"
      )}
      aria-label={voted ? "Remove vote" : "Vote for this book"}
    >
      <Heart
        className="w-4 h-4 transition-transform active:scale-125"
        fill={voted ? "currentColor" : "none"}
      />
      <span className="tabular-nums font-medium">{count}</span>
    </button>
  );
}

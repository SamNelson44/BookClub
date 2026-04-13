"use client";

import { useFormStatus } from "react-dom";
import { Heart } from "lucide-react";
import { toggleVoteAction } from "@/actions/votes";
import { cn } from "@/lib/utils";

interface VotingPanelProps {
  bookId: string;
  voteCount: number;
  userHasVoted: boolean;
}

function VoteButton({ userHasVoted, voteCount }: { userHasVoted: boolean; voteCount: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60",
        userHasVoted
          ? "text-sage"
          : "text-coffee/40 hover:text-coffee/70 dark:text-stone-500 dark:hover:text-stone-300"
      )}
      aria-label={userHasVoted ? "Remove vote" : "Vote for this book"}
    >
      <Heart
        className="w-4 h-4 transition-transform active:scale-125"
        fill={userHasVoted ? "currentColor" : "none"}
      />
      <span className="tabular-nums font-medium">{voteCount}</span>
    </button>
  );
}

export function VotingPanel({ bookId, voteCount, userHasVoted }: VotingPanelProps) {
  return (
    <form action={toggleVoteAction}>
      <input type="hidden" name="bookId" value={bookId} />
      <VoteButton userHasVoted={userHasVoted} voteCount={voteCount} />
    </form>
  );
}

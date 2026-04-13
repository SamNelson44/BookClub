"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { MessageCircle, Trash2, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { addCommentAction, deleteCommentAction } from "@/actions/comments";
import { formatDate } from "@/lib/utils";
import type { Comment, Profile } from "@/lib/types";

interface CommentThreadProps {
  bookId: string;
  comments: Comment[];
  currentUser: Profile;
}

function PostButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-sage text-parchment rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
    >
      {pending && <Loader2 className="w-3 h-3 animate-spin" />}
      Post
    </button>
  );
}

export function CommentThread({ bookId, comments, currentUser }: CommentThreadProps) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [state, formAction] = useActionState(addCommentAction, null);

  useEffect(() => {
    if (state?.success) setContent("");
  }, [state]);

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-coffee/60 dark:text-stone-400 hover:text-coffee dark:hover:text-stone-200 transition-colors"
        aria-expanded={expanded}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {comments.length === 0
          ? "Add comment"
          : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 animate-fade-in">
          {comments.length === 0 && (
            <p className="text-xs text-coffee/40 dark:text-stone-500 italic">
              Be the first to comment…
            </p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 group">
              <Avatar
                name={comment.profile?.name ?? "?"}
                avatarUrl={comment.profile?.avatar_url}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-coffee dark:text-stone-200">
                    {comment.profile?.name ?? "Member"}
                  </span>
                  <span className="text-xs text-coffee/40 dark:text-stone-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-coffee/80 dark:text-stone-300 mt-0.5 break-words">
                  {comment.content}
                </p>
              </div>
              {(comment.user_id === currentUser.id || currentUser.role === "host") && (
                <form action={deleteCommentAction} className="flex-shrink-0">
                  <input type="hidden" name="commentId" value={comment.id} />
                  <button
                    type="submit"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-coffee/30 dark:text-stone-600 hover:text-red-400"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          ))}

          {state?.error && (
            <p className="text-xs text-red-500 dark:text-red-400">{state.error}</p>
          )}

          <form action={formAction} className="space-y-2 pt-1">
            <input type="hidden" name="bookId" value={bookId} />
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Say something…"
              maxLength={500}
              rows={2}
              className="w-full text-sm border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2 text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800 resize-none"
            />
            <PostButton />
          </form>
        </div>
      )}
    </div>
  );
}

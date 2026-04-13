import Image from "next/image";
import { BookOpen, User, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VotingPanel } from "@/components/features/VotingPanel";
import { CommentThread } from "@/components/ui/CommentThread";
import type { IdeaPoolBook, Comment, Profile } from "@/lib/types";

interface BookCardProps {
  book: IdeaPoolBook;
  currentUser: Profile;
  userHasVoted: boolean;
  comments: Comment[];
}

export function BookCard({ book, currentUser, userHasVoted, comments }: BookCardProps) {
  return (
    <article className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden hover:shadow-cozy-md transition-shadow flex flex-col">
      {/* Cover */}
      <div className="relative h-40 bg-sage-50 dark:bg-stone-800 flex-shrink-0">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-sage-200 dark:text-stone-600" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {book.genre && (
          <div className="mb-2">
            <Badge variant="genre" label={book.genre} />
          </div>
        )}

        <h3 className="font-serif text-lg text-coffee dark:text-stone-100 leading-snug mb-0.5">
          {book.title}
        </h3>
        <p className="text-sm text-coffee/60 dark:text-stone-400 mb-3">{book.author}</p>

        {book.description && (
          <p className="text-sm text-coffee/70 dark:text-stone-400 leading-relaxed mb-4 line-clamp-3 flex-1">
            {book.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-coffee/50 dark:text-stone-500 mb-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {book.page_count.toLocaleString()} pages
          </span>
          {book.suggested_by_name && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {book.suggested_by_name}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-sage-50 dark:border-stone-800 space-y-3">
          <VotingPanel
            bookId={book.id}
            voteCount={book.vote_count}
            userHasVoted={userHasVoted}
          />
          <CommentThread
            bookId={book.id}
            comments={comments}
            currentUser={currentUser}
          />
        </div>
      </div>
    </article>
  );
}

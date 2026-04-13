import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BookCard } from "@/components/ui/BookCard";
import { AddBookForm } from "@/components/features/AddBookForm";
import { SelectionModal } from "@/components/features/SelectionModal";
import type { IdeaPoolBook, Comment } from "@/lib/types";

export const metadata: Metadata = { title: "Idea Pool — Tan Clan Book Club" };

export default async function IdeaPoolPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: books } = await supabase
    .from("idea_pool_books")
    .select("*")
    .order("vote_count", { ascending: false })
    .order("created_at", { ascending: true });

  const ideaBooks = (books as IdeaPoolBook[]) ?? [];

  const { data: userVotes } = await supabase
    .from("votes")
    .select("book_id")
    .eq("user_id", profile.id);

  const votedIds = new Set((userVotes ?? []).map((v) => v.book_id));

  const bookIds = ideaBooks.map((b) => b.id);
  let commentsByBook: Record<string, Comment[]> = {};

  if (bookIds.length > 0) {
    const { data: comments } = await supabase
      .from("comments")
      .select("*, profile:profiles(name, avatar_url)")
      .in("book_id", bookIds)
      .order("created_at", { ascending: true });

    for (const comment of (comments as Comment[]) ?? []) {
      if (!commentsByBook[comment.book_id]) commentsByBook[comment.book_id] = [];
      commentsByBook[comment.book_id].push(comment);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Idea Pool</h1>
          <p className="text-coffee/60 dark:text-stone-400 mt-1">
            Suggest books and vote for your favourites.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {profile.role === "host" && ideaBooks.length > 0 && (
            <SelectionModal books={ideaBooks} />
          )}
          <AddBookForm />
        </div>
      </div>

      {ideaBooks.length === 0 ? (
        <EmptyIdeaPool />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ideaBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              currentUser={profile}
              userHasVoted={votedIds.has(book.id)}
              comments={commentsByBook[book.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyIdeaPool() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-50 dark:bg-stone-800 rounded-full mb-6">
        <Lightbulb className="w-10 h-10 text-sage-200 dark:text-stone-600" />
      </div>
      <h2 className="text-xl font-serif text-coffee dark:text-stone-100 mb-2">No ideas yet</h2>
      <p className="text-coffee/60 dark:text-stone-400 text-sm max-w-xs mx-auto mb-6">
        Be the first to suggest a book for the group!
      </p>
    </div>
  );
}

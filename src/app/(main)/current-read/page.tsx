import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { ProgressUpdater } from "@/components/features/ProgressUpdater";
import { ReadingGoalCard } from "@/components/features/ReadingGoalCard";
import { CommentThread } from "@/components/ui/CommentThread";
import type { Book, Progress, Comment } from "@/lib/types";

export const metadata: Metadata = { title: "Current Read — Tan Clan Book Club" };

export default async function CurrentReadPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("status", "current")
    .maybeSingle();

  if (!book) return <NoCurrentBook />;

  const currentBook = book as Book;

  const { data: progressData } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", profile.id)
    .eq("book_id", currentBook.id)
    .maybeSingle();

  const progress = progressData as Progress | null;

  const { data: commentsData } = await supabase
    .from("comments")
    .select("*, profile:profiles(name, avatar_url)")
    .eq("book_id", currentBook.id)
    .order("created_at", { ascending: true });

  const comments = (commentsData as Comment[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Current Read</h1>
        <p className="text-coffee/60 dark:text-stone-400 mt-1">Update your progress and discuss.</p>
      </div>

      {/* Book detail card */}
      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
        <div className="sm:flex">
          <div className="relative h-56 sm:h-auto sm:w-48 flex-shrink-0 bg-sage-50 dark:bg-stone-800">
            {currentBook.cover_url ? (
              <Image
                src={currentBook.cover_url}
                alt={`Cover of ${currentBook.title}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-sage-200 dark:text-stone-600" />
              </div>
            )}
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <Badge variant="current" className="mb-2" />
                <h2 className="text-2xl font-serif text-coffee dark:text-stone-100">{currentBook.title}</h2>
                <p className="text-coffee/60 dark:text-stone-400 mt-1">{currentBook.author}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {currentBook.genre && <Badge variant="genre" label={currentBook.genre} />}
                <p className="text-xs text-coffee/50 dark:text-stone-500 mt-1.5">
                  {currentBook.page_count.toLocaleString()} pages
                </p>
              </div>
            </div>
            {currentBook.description && (
              <p className="text-sm text-coffee/70 dark:text-stone-400 leading-relaxed">
                {currentBook.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly goal */}
      <ReadingGoalCard
        bookId={currentBook.id}
        pageCount={currentBook.page_count}
        goalPage={currentBook.goal_page}
        goalDate={currentBook.goal_date}
        currentPage={progress?.current_page ?? 0}
        isHost={profile.role === "host"}
      />

      {/* Progress updater */}
      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6">
        <h2 className="font-serif text-lg text-coffee dark:text-stone-100 mb-4">Your Progress</h2>
        <ProgressUpdater
          bookId={currentBook.id}
          pageCount={currentBook.page_count}
          currentPage={progress?.current_page ?? 0}
        />
      </div>

      {/* Comments */}
      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6">
        <h2 className="font-serif text-lg text-coffee dark:text-stone-100 mb-4">Discussion</h2>
        <CommentThread bookId={currentBook.id} comments={comments} currentUser={profile} />
      </div>
    </div>
  );
}

function NoCurrentBook() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-50 dark:bg-stone-800 rounded-full mb-6">
        <BookOpen className="w-10 h-10 text-sage-200 dark:text-stone-600" />
      </div>
      <h2 className="text-xl font-serif text-coffee dark:text-stone-100 mb-2">No book selected yet</h2>
      <p className="text-coffee/60 dark:text-stone-400 text-sm max-w-xs mx-auto mb-6">
        The host needs to select a book from the Idea Pool first.
      </p>
      <Link
        href="/idea-pool"
        className="inline-flex items-center gap-2 bg-sage text-parchment rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-sage-700 transition-colors"
      >
        Go to Idea Pool
      </Link>
    </div>
  );
}

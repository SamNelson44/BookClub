import type { Metadata } from "next";
import { BookOpen, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { startNextBookAction, unsetUpNextAction } from "@/actions/books";
import type { DashboardProgress, Book, Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard — Tan Clan Book Club" };

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: currentBook } = await supabase
    .from("books")
    .select("*")
    .eq("status", "current")
    .maybeSingle();

  const { data: upNextBook } = await supabase
    .from("books")
    .select("*")
    .eq("status", "next")
    .maybeSingle();

  let memberProgress: DashboardProgress[] = [];
  if (currentBook) {
    const { data } = await supabase
      .from("dashboard_progress")
      .select("*")
      .order("percent_read", { ascending: false });
    memberProgress = (data as DashboardProgress[]) ?? [];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Dashboard</h1>
        <p className="text-coffee/60 dark:text-stone-400 mt-1">See how everyone is getting on.</p>
      </div>

      {!currentBook ? (
        <EmptyDashboard />
      ) : (
        <>
          <CurrentBookBanner book={currentBook as Book} />
          <ProgressSection members={memberProgress} pageCount={(currentBook as Book).page_count} />
        </>
      )}

      {upNextBook && (
        <UpNextSection book={upNextBook as Book} profile={profile} />
      )}
    </div>
  );
}

function CurrentBookBanner({ book }: { book: Book }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6 flex items-start gap-5">
      <div className="relative flex-shrink-0 w-16 h-24 bg-sage-50 dark:bg-stone-800 rounded-lg overflow-hidden">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-sage-200 dark:text-stone-600" />
          </div>
        )}
      </div>
      <div>
        <Badge variant="current" />
        <h2 className="text-xl font-serif text-coffee dark:text-stone-100 mt-2">{book.title}</h2>
        <p className="text-coffee/60 dark:text-stone-400 text-sm mt-0.5">{book.author}</p>
        {book.genre && <Badge variant="genre" label={book.genre} className="mt-2" />}
        <p className="text-xs text-coffee/50 dark:text-stone-500 mt-2">
          {book.page_count.toLocaleString()} pages
        </p>
      </div>
    </div>
  );
}

function ProgressSection({ members, pageCount }: { members: DashboardProgress[]; pageCount: number }) {
  if (members.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6 text-center text-coffee/50 dark:text-stone-500 text-sm">
        No progress logged yet — be the first!{" "}
        <Link href="/current-read" className="text-sage hover:underline font-medium">
          Go to Current Read
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-50 dark:border-stone-800">
        <h2 className="font-serif text-lg text-coffee dark:text-stone-100">Reading Progress</h2>
      </div>
      <ul className="divide-y divide-sage-50 dark:divide-stone-800">
        {members.map((m) => (
          <li key={m.user_id} className="px-6 py-4 flex items-center gap-4">
            <Avatar name={m.member_name} avatarUrl={m.avatar_url} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-coffee dark:text-stone-100 truncate">
                  {m.member_name}
                </span>
                {m.finished_at && <Badge variant="finished" />}
              </div>
              <ProgressBar value={m.percent_read} showLabel />
            </div>
            <span className="text-xs text-coffee/50 dark:text-stone-500 tabular-nums flex-shrink-0 hidden sm:block">
              {m.current_page.toLocaleString()} / {pageCount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UpNextSection({ book, profile }: { book: Book; profile: Profile }) {
  const isHost = profile.role === "host";

  return (
    <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-50 dark:border-stone-800 flex items-center justify-between">
        <h2 className="font-serif text-lg text-coffee dark:text-stone-100">Up Next</h2>
        {isHost && (
          <div className="flex items-center gap-3">
            <form action={unsetUpNextAction}>
              <input type="hidden" name="bookId" value={book.id} />
              <button
                type="submit"
                className="text-xs text-coffee/40 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-300 transition-colors"
              >
                Remove
              </button>
            </form>
            <form action={startNextBookAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs bg-sage text-parchment rounded-lg px-3 py-1.5 font-medium hover:bg-sage-700 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Start this book
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="p-6 flex items-start gap-5">
        <div className="relative flex-shrink-0 w-14 h-20 bg-sage-50 dark:bg-stone-800 rounded-lg overflow-hidden">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-sage-200 dark:text-stone-600" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-serif text-lg text-coffee dark:text-stone-100">{book.title}</h3>
          <p className="text-sm text-coffee/60 dark:text-stone-400 mt-0.5">{book.author}</p>
          {book.genre && <Badge variant="genre" label={book.genre} className="mt-2" />}
          <p className="text-xs text-coffee/50 dark:text-stone-500 mt-2">
            {book.page_count.toLocaleString()} pages
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-50 dark:bg-stone-800 rounded-full mb-6">
        <BookOpen className="w-10 h-10 text-sage-200 dark:text-stone-600" />
      </div>
      <h2 className="text-xl font-serif text-coffee dark:text-stone-100 mb-2">No book selected yet</h2>
      <p className="text-coffee/60 dark:text-stone-400 text-sm max-w-xs mx-auto mb-6">
        Head to the Idea Pool and vote for a book, or ask the host to pick one.
      </p>
      <Link
        href="/idea-pool"
        className="inline-flex items-center gap-2 bg-sage text-parchment rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-sage-700 transition-colors"
      >
        View Idea Pool
      </Link>
    </div>
  );
}

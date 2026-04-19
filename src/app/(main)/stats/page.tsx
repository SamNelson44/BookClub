import type { Metadata } from "next";
import { BookOpen, TrendingUp, Users, FileText } from "lucide-react";
import Image from "next/image";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Book } from "@/lib/types";

export const metadata: Metadata = { title: "Stats — Tan Clan Book Club" };

interface FinishedProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  finished_at: string;
  profile: { name: string; avatar_url: string | null };
}

interface MemberRow {
  id: string;
  name: string;
  avatar_url: string | null;
}

export default async function StatsPage() {
  await requireProfile();
  const supabase = await createClient();

  const { data: completedBooks } = await supabase
    .from("books")
    .select("*")
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const books = (completedBooks as Book[]) ?? [];
  const completedBookIds = books.map((b) => b.id);

  let finishedProgress: FinishedProgress[] = [];
  if (completedBookIds.length > 0) {
    const { data } = await supabase
      .from("progress")
      .select("*, profile:profiles(name, avatar_url)")
      .in("book_id", completedBookIds)
      .not("finished_at", "is", null);
    finishedProgress = (data as FinishedProgress[]) ?? [];
  }

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, name, avatar_url");
  const members = (profilesData as MemberRow[]) ?? [];

  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + b.page_count, 0);
  const avgPages = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;

  const memberStats = members
    .map((m) => {
      const finished = finishedProgress.filter((p) => p.user_id === m.id);
      const pagesRead = finished.reduce((sum, p) => {
        const book = books.find((b) => b.id === p.book_id);
        return sum + (book?.page_count ?? 0);
      }, 0);
      return { ...m, booksFinished: finished.length, pagesRead };
    })
    .sort((a, b) => b.booksFinished - a.booksFinished || b.pagesRead - a.pagesRead);

  const genreCounts: Record<string, number> = {};
  for (const book of books) {
    const g = book.genre ?? "Unknown";
    genreCounts[g] = (genreCounts[g] ?? 0) + 1;
  }
  const genres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const maxGenreCount = genres[0]?.[1] ?? 1;

  const finishedByBook: Record<string, FinishedProgress[]> = {};
  for (const p of finishedProgress) {
    if (!finishedByBook[p.book_id]) finishedByBook[p.book_id] = [];
    finishedByBook[p.book_id].push(p);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Club Stats</h1>
        <p className="text-coffee/60 dark:text-stone-400 mt-1">Our reading journey so far.</p>
      </div>

      {totalBooks === 0 ? (
        <EmptyStats />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={BookOpen} label="Books Read" value={totalBooks} />
            <StatCard icon={FileText} label="Total Pages" value={totalPages.toLocaleString()} />
            <StatCard icon={Users} label="Members" value={members.length} />
            <StatCard icon={TrendingUp} label="Avg Pages/Book" value={avgPages.toLocaleString()} />
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-sage-50 dark:border-stone-800">
              <h2 className="font-serif text-lg text-coffee dark:text-stone-100">Books We've Read</h2>
            </div>
            <ul className="divide-y divide-sage-50 dark:divide-stone-800">
              {books.map((book) => (
                <CompletedBookRow
                  key={book.id}
                  book={book}
                  finishers={finishedByBook[book.id] ?? []}
                  memberCount={members.length}
                />
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-sage-50 dark:border-stone-800">
                <h2 className="font-serif text-lg text-coffee dark:text-stone-100">Member Leaderboard</h2>
              </div>
              <ul className="divide-y divide-sage-50 dark:divide-stone-800">
                {memberStats.map((m, i) => (
                  <li key={m.id} className="px-6 py-3 flex items-center gap-3">
                    <span className="text-sm font-medium text-coffee/30 dark:text-stone-600 w-5 text-right tabular-nums">
                      {i + 1}
                    </span>
                    <Avatar name={m.name} avatarUrl={m.avatar_url} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-coffee dark:text-stone-100 truncate">{m.name}</p>
                      <p className="text-xs text-coffee/50 dark:text-stone-500">
                        {m.pagesRead.toLocaleString()} pages read
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-sage">{m.booksFinished}</p>
                      <p className="text-xs text-coffee/40 dark:text-stone-500">finished</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {genres.length > 0 && (
              <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-sage-50 dark:border-stone-800">
                  <h2 className="font-serif text-lg text-coffee dark:text-stone-100">Genres Read</h2>
                </div>
                <ul className="px-6 py-4 space-y-3">
                  {genres.map(([genre, count]) => (
                    <li key={genre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-coffee dark:text-stone-300">{genre}</span>
                        <span className="text-xs text-coffee/50 dark:text-stone-500 tabular-nums">
                          {count} {count === 1 ? "book" : "books"}
                        </span>
                      </div>
                      <div className="h-2 bg-sage-50 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sage rounded-full"
                          style={{ width: `${(count / maxGenreCount) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-sage-50 dark:bg-stone-800 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-sage" />
        </div>
        <p className="text-xs text-coffee/50 dark:text-stone-500 font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-serif text-coffee dark:text-stone-100">{value}</p>
    </div>
  );
}

function CompletedBookRow({
  book,
  finishers,
  memberCount,
}: {
  book: Book;
  finishers: FinishedProgress[];
  memberCount: number;
}) {
  return (
    <li className="px-6 py-4 flex items-start gap-4">
      <div className="relative flex-shrink-0 w-10 h-14 bg-sage-50 dark:bg-stone-800 rounded-lg overflow-hidden">
        {book.cover_url ? (
          <Image src={book.cover_url} alt={`Cover of ${book.title}`} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sage-200 dark:text-stone-600" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-coffee dark:text-stone-100">{book.title}</h3>
            <p className="text-xs text-coffee/50 dark:text-stone-500 mt-0.5">{book.author}</p>
          </div>
          {book.genre && <Badge variant="genre" label={book.genre} />}
        </div>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="text-xs text-coffee/40 dark:text-stone-500">
            {book.page_count.toLocaleString()} pages
          </span>
          {finishers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                {finishers.slice(0, 6).map((f) => (
                  <Avatar key={f.user_id} name={f.profile.name} avatarUrl={f.profile.avatar_url} size="xs" />
                ))}
              </div>
              <span className="text-xs text-coffee/40 dark:text-stone-500">
                {finishers.length}/{memberCount} finished
              </span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function EmptyStats() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-50 dark:bg-stone-800 rounded-full mb-6">
        <TrendingUp className="w-10 h-10 text-sage-200 dark:text-stone-600" />
      </div>
      <h2 className="text-xl font-serif text-coffee dark:text-stone-100 mb-2">No books completed yet</h2>
      <p className="text-coffee/60 dark:text-stone-400 text-sm max-w-xs mx-auto">
        Stats will appear here once you've finished your first book.
      </p>
    </div>
  );
}

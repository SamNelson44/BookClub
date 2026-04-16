import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/features/ProfileForm";
import { AddBookForm } from "@/components/features/AddBookForm";
import { EditBookForm } from "@/components/features/EditBookForm";
import { Badge } from "@/components/ui/Badge";
import { publishBookAction, unpublishBookAction, deleteOwnBookAction } from "@/actions/books";
import { BookOpen, Globe, Lock, Trash2 } from "lucide-react";
import type { Book } from "@/lib/types";

export const metadata: Metadata = { title: "Profile — Tan Clan Book Club" };

export default async function ProfilePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: myBooksData } = await supabase
    .from("books")
    .select("*")
    .eq("suggested_by", profile.id)
    .in("status", ["draft", "idea"])
    .order("created_at", { ascending: false });

  const myBooks = (myBooksData as Book[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Your Profile</h1>
        <p className="text-coffee/60 dark:text-stone-400 mt-1">Update your name, picture, and book list.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">
        {/* Profile form */}
        <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6">
          <div className="flex items-center gap-2 mb-6 pb-5 border-b border-sage-50 dark:border-stone-800">
            <span className="text-sm text-coffee/60 dark:text-stone-400">Role:</span>
            <Badge variant={profile.role} />
          </div>
          <ProfileForm initialName={profile.name} initialAvatarUrl={profile.avatar_url} />
        </div>

        {/* My book list */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-serif text-coffee dark:text-stone-100">My Book List</h2>
              <p className="text-sm text-coffee/60 dark:text-stone-400 mt-0.5">
                Add books privately, then publish the ones you want the club to vote on.
              </p>
            </div>
            <AddBookForm />
          </div>

        {myBooks.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-sage-50 dark:bg-stone-800 rounded-full mb-4">
              <BookOpen className="w-7 h-7 text-sage-200 dark:text-stone-600" />
            </div>
            <p className="text-coffee/60 dark:text-stone-400 text-sm">
              No books yet — add one to get started!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {myBooks.map((book) => (
              <li
                key={book.id}
                className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium text-coffee dark:text-stone-100">
                        {book.title}
                      </h3>
                      {book.genre && <Badge variant="genre" label={book.genre} />}
                      {book.status === "idea" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-sage font-medium">
                          <Globe className="w-3 h-3" />
                          In Idea Pool
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-coffee/40 dark:text-stone-500">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-coffee/60 dark:text-stone-400">
                      {book.author} · {book.page_count.toLocaleString()} pages
                    </p>
                    {book.description && (
                      <p className="text-xs text-coffee/50 dark:text-stone-500 mt-1 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {book.status === "draft" ? (
                      <form action={publishBookAction}>
                        <input type="hidden" name="bookId" value={book.id} />
                        <button
                          type="submit"
                          className="text-xs bg-sage text-parchment rounded-lg px-3 py-1.5 font-medium hover:bg-sage-700 transition-colors"
                        >
                          Publish
                        </button>
                      </form>
                    ) : (
                      <form action={unpublishBookAction}>
                        <input type="hidden" name="bookId" value={book.id} />
                        <button
                          type="submit"
                          className="text-xs border border-sage-200 dark:border-stone-600 text-coffee/60 dark:text-stone-400 rounded-lg px-3 py-1.5 font-medium hover:bg-sage-50 dark:hover:bg-stone-800 transition-colors"
                        >
                          Unpublish
                        </button>
                      </form>
                    )}

                    <EditBookForm book={book} />

                    {book.status === "draft" && (
                      <form action={deleteOwnBookAction}>
                        <input type="hidden" name="bookId" value={book.id} />
                        <button
                          type="submit"
                          className="text-coffee/30 dark:text-stone-600 hover:text-red-400 transition-colors p-1"
                          aria-label="Delete book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </div>
  );
}

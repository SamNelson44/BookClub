"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProgress(bookId: string, currentPage: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Fetch page count to determine finished state
  const { data: book } = await supabase
    .from("books")
    .select("page_count")
    .eq("id", bookId)
    .single();

  if (!book) return { error: "Book not found." };

  const clampedPage = Math.max(0, Math.min(currentPage, book.page_count));
  const finishedAt =
    clampedPage >= book.page_count ? new Date().toISOString() : null;

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      book_id: bookId,
      current_page: clampedPage,
      finished_at: finishedAt,
    },
    { onConflict: "user_id,book_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/current-read");
  return { success: true };
}

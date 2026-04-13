"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProgressAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const bookId = formData.get("bookId") as string;
  const currentPage = parseInt(formData.get("page") as string, 10);

  if (!bookId || isNaN(currentPage)) return;

  const { data: book } = await supabase
    .from("books")
    .select("page_count")
    .eq("id", bookId)
    .single();

  if (!book) return;

  const clampedPage = Math.max(0, Math.min(currentPage, book.page_count));
  const finishedAt = clampedPage >= book.page_count ? new Date().toISOString() : null;

  await supabase.from("progress").upsert(
    {
      user_id: user.id,
      book_id: bookId,
      current_page: clampedPage,
      finished_at: finishedAt,
    },
    { onConflict: "user_id,book_id" }
  );

  revalidatePath("/dashboard");
  revalidatePath("/current-read");
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleVoteAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const bookId = formData.get("bookId") as string;
  if (!bookId) return;

  const { data: existing } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .maybeSingle();

  if (existing) {
    await supabase.from("votes").delete().eq("id", existing.id);
  } else {
    await supabase.from("votes").insert({ user_id: user.id, book_id: bookId });
  }

  revalidatePath("/idea-pool");
}

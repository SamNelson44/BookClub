"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addComment(bookId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 500) {
    return { error: "Comment must be between 1 and 500 characters." };
  }

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    book_id: bookId,
    content: trimmed,
  });

  if (error) return { error: error.message };

  revalidatePath("/idea-pool");
  revalidatePath("/current-read");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath("/idea-pool");
  revalidatePath("/current-read");
  return { success: true };
}

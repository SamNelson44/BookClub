"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCommentAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const bookId = formData.get("bookId") as string;
  const content = (formData.get("content") as string)?.trim();

  if (!content || content.length > 500) {
    return { error: "Comment must be between 1 and 500 characters." };
  }

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    book_id: bookId,
    content,
  });

  if (error) return { error: error.message };

  revalidatePath("/idea-pool");
  revalidatePath("/current-read");
  return { success: true };
}

export async function deleteCommentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const commentId = formData.get("commentId") as string;
  if (!commentId) return;

  await supabase.from("comments").delete().eq("id", commentId);

  revalidatePath("/idea-pool");
  revalidatePath("/current-read");
}

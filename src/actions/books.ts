"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addBook(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const author = (formData.get("author") as string)?.trim();
  const genre = (formData.get("genre") as string)?.trim() || null;
  const pageCountRaw = formData.get("page_count") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const cover_url = (formData.get("cover_url") as string)?.trim() || null;

  if (!title || !author || !pageCountRaw) {
    return { error: "Title, author, and page count are required." };
  }

  const page_count = parseInt(pageCountRaw, 10);
  if (isNaN(page_count) || page_count <= 0) {
    return { error: "Page count must be a positive number." };
  }

  const { error } = await supabase.from("books").insert({
    title,
    author,
    genre,
    page_count,
    description,
    cover_url,
    suggested_by: user.id,
    status: "idea",
  });

  if (error) return { error: error.message };

  revalidatePath("/idea-pool");
  return { success: true };
}

export async function selectBook(
  bookId: string,
  method: "pick" | "top_voted"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Verify host role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "host") {
    return { error: "Only the host can select a book." };
  }

  let selectedBookId = bookId;

  // If random pick, select server-side
  if (method === "pick") {
    const { data: ideaBooks } = await supabase
      .from("books")
      .select("id")
      .eq("status", "idea");

    if (!ideaBooks || ideaBooks.length === 0) {
      return { error: "No books in the Idea Pool." };
    }

    selectedBookId =
      ideaBooks[Math.floor(Math.random() * ideaBooks.length)].id;
  }

  // Move any current book to completed
  await supabase
    .from("books")
    .update({ status: "completed" })
    .eq("status", "current");

  // Promote selected book
  const { error } = await supabase
    .from("books")
    .update({ status: "current" })
    .eq("id", selectedBookId);

  if (error) return { error: error.message };

  revalidatePath("/idea-pool");
  revalidatePath("/current-read");
  revalidatePath("/dashboard");

  redirect("/current-read");
}

export async function deleteBook(bookId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "host") {
    return { error: "Only the host can delete books." };
  }

  const { error } = await supabase.from("books").delete().eq("id", bookId);
  if (error) return { error: error.message };

  revalidatePath("/idea-pool");
  return { success: true };
}

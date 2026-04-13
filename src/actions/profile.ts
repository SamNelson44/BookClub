"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const name = (formData.get("name") as string)?.trim();
  const avatar_url = (formData.get("avatar_url") as string)?.trim() || null;

  if (!name) return { error: "Name is required." };

  const { error } = await supabase
    .from("profiles")
    .update({ name, avatar_url })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/idea-pool");
  revalidatePath("/current-read");
  return { success: true };
}

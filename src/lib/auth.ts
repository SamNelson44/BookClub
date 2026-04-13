import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** Get the authenticated Supabase user, or null. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Get a user's profile row by id. */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as Profile | null;
}

/** Assert the user is authenticated; redirect to /login if not. */
export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/** Assert the user is authenticated and return their profile. */
export async function requireProfile() {
  const user = await requireAuth();
  const profile = await getProfile(user.id);
  if (!profile) redirect("/login");
  return profile;
}

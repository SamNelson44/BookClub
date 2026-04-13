import { redirect } from "next/navigation";

// The root "/" redirects based on auth state, handled by middleware.
// This page exists as a fallback; middleware handles the actual redirect.
export default function RootPage() {
  redirect("/dashboard");
}

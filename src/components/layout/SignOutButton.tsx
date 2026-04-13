"use client";

import { useTransition } from "react";
import { signOut } from "@/actions/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-coffee/60 dark:text-stone-400 hover:text-coffee dark:hover:text-stone-200 hover:bg-sage-50 dark:hover:bg-stone-800 rounded-xl transition-colors disabled:opacity-50"
      aria-label="Sign out"
    >
      <LogOut className="w-4 h-4" />
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}

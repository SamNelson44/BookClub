"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/actions/auth";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <>
      <h2 className="text-2xl font-serif text-coffee dark:text-stone-100 mb-6">Welcome back</h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-sage text-parchment rounded-xl px-4 py-2.5 font-medium hover:bg-sage-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-coffee/60 dark:text-stone-400 mt-6">
        New to the club?{" "}
        <Link href="/register" className="text-sage font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}

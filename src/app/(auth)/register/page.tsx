import Link from "next/link";
import { signUp } from "@/actions/auth";

const errorMessages: Record<string, string> = {
  required: "All fields are required.",
  short:    "Password must be at least 6 characters.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (errorMessages[error] ?? decodeURIComponent(error)) : null;

  return (
    <>
      <h2 className="text-2xl font-serif text-coffee dark:text-stone-100 mb-6">Create account</h2>

      {errorMessage && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <form action={signUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="e.g. Jane Doe"
            className="w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800"
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sage text-parchment rounded-xl px-4 py-2.5 font-medium hover:bg-sage-700 transition-colors flex items-center justify-center mt-2"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-coffee/60 dark:text-stone-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-sage font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}

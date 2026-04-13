"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { updateProfile } from "@/actions/profile";

interface ProfileFormProps {
  initialName: string;
  initialAvatarUrl: string | null;
}

const inputClass =
  "w-full border border-sage-200 dark:border-stone-600 rounded-xl px-3 py-2.5 text-coffee dark:text-stone-100 placeholder:text-coffee/40 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white dark:bg-stone-800";

export function ProfileForm({ initialName, initialAvatarUrl }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  const previewUrl = avatarUrl.trim() || null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-3 py-4">
        <Avatar name={name || "?"} avatarUrl={previewUrl} size="lg" />
        <p className="text-xs text-coffee/50 dark:text-stone-500">Preview updates as you type</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 bg-sage-50 dark:bg-sage/10 border border-sage-100 dark:border-sage/30 rounded-xl text-sm text-sage">
          Profile updated!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="name">
          Display name
        </label>
        <input
          id="name" name="name" type="text" required
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-coffee dark:text-stone-200 mb-1.5" htmlFor="avatar_url">
          Profile picture URL{" "}
          <span className="text-coffee/40 dark:text-stone-500 font-normal">(optional)</span>
        </label>
        <input
          id="avatar_url" name="avatar_url" type="url"
          value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://…"
          className={inputClass}
        />
        <p className="text-xs text-coffee/50 dark:text-stone-500 mt-1.5">
          Paste a link to any image — a photo, avatar, anything you like.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-sage text-parchment rounded-xl px-4 py-2.5 font-medium hover:bg-sage-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

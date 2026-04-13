import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth";
import { ProfileForm } from "@/components/features/ProfileForm";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Profile — Tan Clan Book Club" };

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Your Profile</h1>
        <p className="text-coffee/60 dark:text-stone-400 mt-1">Update your name and picture.</p>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6 max-w-md">
        <div className="flex items-center gap-2 mb-6 pb-5 border-b border-sage-50 dark:border-stone-800">
          <span className="text-sm text-coffee/60 dark:text-stone-400">Role:</span>
          <Badge variant={profile.role} />
        </div>
        <ProfileForm initialName={profile.name} initialAvatarUrl={profile.avatar_url} />
      </div>
    </div>
  );
}

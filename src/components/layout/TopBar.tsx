import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { requireProfile } from "@/lib/auth";

export async function TopBar() {
  const profile = await requireProfile();

  return (
    <header className="lg:hidden sticky top-0 z-20 bg-parchment/90 dark:bg-stone-950/90 backdrop-blur-sm border-b border-sage-100 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 bg-sage rounded-lg">
          <BookOpen className="w-4 h-4 text-parchment" />
        </div>
        <span className="font-serif text-base text-coffee dark:text-stone-100">Tan Clan Book Club</span>
      </div>
      <Link href="/profile" aria-label="Your profile">
        <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" />
      </Link>
    </header>
  );
}

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { Profile } from "@/lib/types";

interface SidebarProps {
  profile: Profile;
}

export function Sidebar({ profile }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-72 bg-white dark:bg-stone-900 border-r border-sage-100 dark:border-stone-800 shadow-cozy z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sage-100 dark:border-stone-800">
        <div className="flex items-center justify-center w-9 h-9 bg-sage rounded-xl">
          <BookOpen className="w-5 h-5 text-parchment" />
        </div>
        <span className="font-serif text-lg text-coffee dark:text-stone-100">Tan Clan Book Club</span>
      </div>

      {/* Nav */}
      <SidebarNav />

      {/* User footer */}
      <div className="px-3 py-4 border-t border-sage-100 dark:border-stone-800 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sage-50 dark:hover:bg-stone-800 transition-colors group"
        >
          <Avatar name={profile.name} avatarUrl={profile.avatar_url} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-coffee dark:text-stone-100 truncate group-hover:text-sage transition-colors">
              {profile.name}
            </p>
            <p className="text-xs text-coffee/50 dark:text-stone-500 capitalize">{profile.role}</p>
          </div>
        </Link>
        <ThemeToggle />
        <SignOutButton />
      </div>
    </aside>
  );
}

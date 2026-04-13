"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Lightbulb, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/idea-pool", label: "Idea Pool", icon: Lightbulb },
  { href: "/current-read", label: "Current Read", icon: BookOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-stone-900 border-t border-sage-100 dark:border-stone-800 shadow-cozy z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active ? "text-sage" : "text-coffee/50 dark:text-stone-500 hover:text-coffee dark:hover:text-stone-300"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

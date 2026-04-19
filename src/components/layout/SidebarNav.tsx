"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Lightbulb, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/idea-pool", label: "Idea Pool", icon: Lightbulb },
  { href: "/current-read", label: "Current Read", icon: BookOpen },
  { href: "/stats", label: "Stats", icon: TrendingUp },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              active
                ? "bg-sage-50 dark:bg-stone-800 text-sage"
                : "text-coffee/70 dark:text-stone-400 hover:bg-sage-50 dark:hover:bg-stone-800 hover:text-coffee dark:hover:text-stone-200"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

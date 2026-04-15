"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "results", label: "경기 현황", href: "/" },
  { id: "standings", label: "순위", href: "/standings" },
  { id: "ai", label: "AI", href: "/ai" },
  { id: "realtime", label: "실시간", href: "/realtime" },
] as const;

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const isActive =
              tab.href === "/" ? pathname === "/" : pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

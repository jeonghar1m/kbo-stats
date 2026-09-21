import Link from "next/link";

export function CompetitionNav({ asianGames = false }: { asianGames?: boolean }) {
  return (
    <nav aria-label="대회 선택" className="mb-5 flex gap-2">
      {[
        { label: "KBO", href: "/", active: !asianGames },
        { label: "아시안게임 · 대한민국", href: "/?competition=asian-games", active: asianGames },
      ].map(({ label, href, active }) => (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

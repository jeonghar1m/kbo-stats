import Link from "next/link";
import { AsianGameCard } from "@/components/asian-game-card";
import {
  ASIAN_GAMES, ASIAN_GAMES_CHECKED_AT, ASIAN_GAMES_SOURCE,
} from "@/lib/asian-games";
import { fetchAsianGameLive } from "@/lib/asian-games-api";

export async function AsianGames({ date, now }: { date?: string; now: number }) {
  const dates = [...new Set(ASIAN_GAMES.map((game) => game.date))];
  const games = ASIAN_GAMES.filter((game) => !date || game.date === date);
  const snapshots = await Promise.all(games.map(fetchAsianGameLive));

  return (
    <section className="space-y-5" aria-labelledby="asian-games-title">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">2026 아이치·나고야</p>
        <h2 id="asian-games-title" className="mt-1 text-xl font-bold">대한민국 야구 일정·결과</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">모든 시간은 한국시간입니다. 일본 현지시간과 같습니다.</p>
      </div>

      <nav aria-label="아시안게임 경기 날짜" className="flex flex-wrap gap-2">
        {[{ label: "전체 일정", value: undefined }, ...dates.map((value) => ({ label: `${Number(value.slice(5, 7))}/${Number(value.slice(8))}`, value }))].map(({ label, value }) => (
          <Link
            key={value ?? "all"}
            href={value ? `/?competition=asian-games&date=${value}` : "/?competition=asian-games"}
            aria-current={date === value ? "page" : undefined}
            className={`rounded-lg border px-3 py-1.5 text-sm ${date === value ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"}`}
          >{label}</Link>
        ))}
      </nav>

      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        목록은 진입 시 공식 기록을 한 번 확인합니다. 경기 상세에서는 점수와 이닝, B/S/O, 주자, 투수·타자를 10초마다 갱신합니다.
        <br />마지막 확인: {ASIAN_GAMES_CHECKED_AT} · <a href={ASIAN_GAMES_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">공식 일정 확인 ↗</a>
      </p>

      {games.length === 0 && <p className="py-12 text-center text-zinc-500">해당 날짜에 등록된 대한민국 경기가 없습니다.</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {games.map((game, index) => (
          <Link
            key={game.id}
            href={`/asian-games/${game.id}`}
            className="block rounded-xl transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <AsianGameCard game={game} now={now} snapshot={snapshots[index]} />
          </Link>
        ))}
      </div>
      <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
        이후 라운드의 한국 경기 일정은 진출 여부와 대진이 확정된 뒤 등록합니다.
      </p>
    </section>
  );
}

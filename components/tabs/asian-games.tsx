import Link from "next/link";
import {
  ASIAN_GAMES, ASIAN_GAMES_CHECKED_AT, ASIAN_GAMES_SOURCE,
  NATIONAL_TEAMS, getAsianGameLabel,
} from "@/lib/asian-games";

export function AsianGames({ date, now }: { date?: string; now: number }) {
  const dates = [...new Set(ASIAN_GAMES.map((game) => game.date))];
  const games = ASIAN_GAMES.filter((game) => !date || game.date === date);

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
        공식 자료를 확인해 수동 갱신합니다. 실시간 점수는 제공하지 않습니다.
        <br />마지막 확인: {ASIAN_GAMES_CHECKED_AT} · <a href={ASIAN_GAMES_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">공식 일정 확인 ↗</a>
      </p>

      {games.length === 0 && <p className="py-12 text-center text-zinc-500">해당 날짜에 등록된 대한민국 경기가 없습니다.</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {games.map((game) => (
          <article key={game.id} aria-label={`${game.date} ${NATIONAL_TEAMS[game.awayTeam]} 대 ${NATIONAL_TEAMS[game.homeTeam]}`} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 px-4 py-3 text-xs dark:bg-zinc-800/50">
              <time dateTime={`${game.date}T${game.startTime}:00+09:00`}>{game.date} · {game.startTime}</time>
              <span className="font-semibold text-blue-700 dark:text-blue-300">{getAsianGameLabel(game, now)}</span>
            </div>
            <div className="space-y-3 p-4">
              {(["away", "home"] as const).map((side) => {
                const team = side === "away" ? game.awayTeam : game.homeTeam;
                return (
                  <div key={side} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-8 w-1 rounded-full ${team === "KOR" ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                      <span className="text-lg font-bold">{NATIONAL_TEAMS[team]}</span>
                      <span className="text-xs text-zinc-400">{side === "away" ? "원정" : "홈"}</span>
                    </div>
                    <span className="font-mono text-2xl font-bold tabular-nums" aria-label={game.score ? `${game.score[side]}점` : "점수 미등록"}>{game.score?.[side] ?? "—"}</span>
                  </div>
                );
              })}
              <p className="text-xs text-zinc-500">{game.round} · {game.stadium}</p>
              {game.status === "FINISHED" && <a href={game.resultSource} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-blue-600 underline dark:text-blue-400">공식 결과 확인 ↗</a>}
            </div>
          </article>
        ))}
      </div>
      <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
        이후 라운드의 한국 경기 일정은 진출 여부와 대진이 확정된 뒤 등록합니다.
      </p>
    </section>
  );
}

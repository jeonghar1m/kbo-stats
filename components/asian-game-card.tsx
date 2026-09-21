import type { AsianGame } from "@/lib/asian-games";
import { NATIONAL_TEAMS, getAsianGameLabel } from "@/lib/asian-games";
import type { AsianGameLiveData, AsianGameLiveResponse } from "@/lib/types";

const STATUS_LABEL: Record<AsianGameLiveData["status"], string> = {
  SCHEDULED: "경기 예정",
  IN_PROGRESS: "경기 중",
  FINISHED: "경기 종료",
  CANCELED: "취소",
  POSTPONED: "연기",
};

export function AsianGameCard({
  game,
  now,
  snapshot,
}: {
  game: AsianGame;
  now: number;
  snapshot: AsianGameLiveResponse;
}) {
  const data = snapshot.available ? snapshot : null;
  const score = data?.score ?? game.score;
  const statusLabel = data
    ? STATUS_LABEL[data.status]
    : getAsianGameLabel(game, now);
  const live = data?.live;

  return (
    <article
      aria-label={`${game.date} ${NATIONAL_TEAMS[game.awayTeam]} 대 ${NATIONAL_TEAMS[game.homeTeam]}`}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 px-4 py-3 text-xs dark:bg-zinc-800/50">
        <time dateTime={`${game.date}T${game.startTime}:00+09:00`}>
          {game.date} · {game.startTime}
        </time>
        <span className={`flex items-center gap-1.5 font-semibold ${live ? "text-red-500" : "text-blue-700 dark:text-blue-300"}`}>
          {live && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
          {live ? `${live.inning}회 ${live.inningHalf}` : statusLabel}
        </span>
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
              <span className="font-mono text-2xl font-bold tabular-nums" aria-label={score ? `${score[side]}점` : "점수 미등록"}>
                {score?.[side] ?? "—"}
              </span>
            </div>
          );
        })}

        <p className="text-xs text-zinc-500">{game.round} · {game.stadium}</p>
      </div>
    </article>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { BaseballDiamond } from "@/components/game-live/baseball-diamond";
import { BatterPitcherInfo } from "@/components/game-live/batter-pitcher-info";
import { SBOCount } from "@/components/game-live/sbo-count";
import type { AsianGame } from "@/lib/asian-games";
import { NATIONAL_TEAMS, getAsianGameLabel } from "@/lib/asian-games";
import type { AsianGameLiveData, AsianGameLiveResponse } from "@/lib/types";

const POLL_INTERVAL = 10_000;
const POLL_BEFORE_START = 15 * 60_000;

const STATUS_LABEL: Record<AsianGameLiveData["status"], string> = {
  SCHEDULED: "경기 예정",
  IN_PROGRESS: "경기 중",
  FINISHED: "경기 종료",
  CANCELED: "취소",
  POSTPONED: "연기",
};

export function AsianGameCard({ game, now }: { game: AsianGame; now: number }) {
  const [data, setData] = useState<AsianGameLiveData | null>(null);
  const [error, setError] = useState(false);
  const scheduledAt = Date.parse(`${game.date}T${game.startTime}:00+09:00`);

  const fetchLive = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/asian-games-live?game_id=${encodeURIComponent(game.id)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("request failed");
      const result = (await response.json()) as AsianGameLiveResponse;
      if (!result.available) throw new Error("data unavailable");
      setData(result);
      setError(false);
      return result.status;
    } catch {
      setError(true);
      return null;
    }
  }, [game.id]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    async function poll() {
      const status = await fetchLive();
      if (disposed) return;
      if (status === "FINISHED" || status === "CANCELED" || status === "POSTPONED") {
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL);
    }

    const untilPolling = scheduledAt - POLL_BEFORE_START - Date.now();
    if (untilPolling <= 0) {
      void poll();
    } else {
      void fetchLive();
      timer = setTimeout(poll, untilPolling);
    }

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
    };
  }, [fetchLive, scheduledAt]);

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

        {live && (
          <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <div className="flex items-center justify-center gap-4 text-xs">
              <span><b className="text-red-500">공격</b> {live.inningHalf === "초" ? NATIONAL_TEAMS[game.awayTeam] : NATIONAL_TEAMS[game.homeTeam]}</span>
              <span className="text-zinc-300">|</span>
              <span><b className="text-blue-500">수비</b> {live.inningHalf === "초" ? NATIONAL_TEAMS[game.homeTeam] : NATIONAL_TEAMS[game.awayTeam]}</span>
            </div>
            <BatterPitcherInfo pitcher={live.pitcher} batter={live.batter} awayFirst={live.inningHalf === "초"} />
            <div className="flex items-center justify-center gap-6">
              <BaseballDiamond bases={live.bases} />
              <SBOCount ballCount={live.ballCount} />
            </div>
            <p className="text-center text-[11px] text-zinc-400">공식 기록 · 10초마다 자동 갱신</p>
          </div>
        )}

        <p className="text-xs text-zinc-500">{game.round} · {game.stadium}</p>
        {error && <p className="text-xs text-amber-600 dark:text-amber-400">실시간 기록을 일시적으로 불러오지 못했습니다.</p>}
        {data?.updatedAt && !error && (
          <p className="text-[11px] text-zinc-400">
            최근 확인 {new Date(data.updatedAt).toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        )}
      </div>
    </article>
  );
}

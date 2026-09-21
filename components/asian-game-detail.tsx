"use client";

import { useCallback, useEffect, useState } from "react";
import { BaseballDiamond } from "@/components/game-live/baseball-diamond";
import { BatterPitcherInfo } from "@/components/game-live/batter-pitcher-info";
import { SBOCount } from "@/components/game-live/sbo-count";
import {
  ASIAN_GAMES_SOURCE,
  NATIONAL_TEAMS,
  getAsianGameLabel,
  type AsianGame,
} from "@/lib/asian-games";
import type {
  AsianGameLiveData,
  AsianGameLiveResponse,
} from "@/lib/types";

const POLL_INTERVAL = 10_000;
const POLL_BEFORE_START = 15 * 60_000;

const STATUS_LABEL: Record<AsianGameLiveData["status"], string> = {
  SCHEDULED: "경기 예정",
  IN_PROGRESS: "경기 중",
  FINISHED: "경기 종료",
  CANCELED: "취소",
  POSTPONED: "연기",
};

function isTerminal(status: AsianGameLiveData["status"] | undefined) {
  return status === "FINISHED" || status === "CANCELED" || status === "POSTPONED";
}

export function AsianGameDetail({
  game,
  initialData,
  now,
}: {
  game: AsianGame;
  initialData: AsianGameLiveResponse;
  now: number;
}) {
  const [data, setData] = useState<AsianGameLiveData | null>(
    initialData.available ? initialData : null,
  );
  const [error, setError] = useState(!initialData.available);
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
      return undefined;
    }
  }, [game.id]);

  useEffect(() => {
    if (isTerminal(initialData.available ? initialData.status : undefined)) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    async function poll() {
      const status = await fetchLive();
      if (disposed || isTerminal(status)) return;
      timer = setTimeout(poll, POLL_INTERVAL);
    }

    const untilPolling = scheduledAt - POLL_BEFORE_START - Date.now();
    if (untilPolling <= 0) {
      void poll();
    } else {
      if (!initialData.available) void fetchLive();
      timer = setTimeout(poll, untilPolling);
    }

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
    };
  }, [fetchLive, initialData, scheduledAt]);

  const score = data?.score ?? game.score;
  const live = data?.live;
  const status = data?.status ?? game.status;
  const statusLabel = data
    ? STATUS_LABEL[data.status]
    : getAsianGameLabel(game, now);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-1.5">
          <div className={`flex-1 ${game.awayTeam === "KOR" ? "bg-blue-600" : "bg-zinc-400"}`} />
          <div className={`flex-1 ${game.homeTeam === "KOR" ? "bg-blue-600" : "bg-zinc-400"}`} />
        </div>
        <div className="px-6 py-8">
          <div className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold">
            {live && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
            <span className={live ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"}>
              {live ? `${live.inning}회 ${live.inningHalf}` : statusLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Team name={NATIONAL_TEAMS[game.awayTeam]} side="원정" korea={game.awayTeam === "KOR"} />
            <div className="min-w-24 text-center">
              {score ? (
                <p className="font-mono text-4xl font-black tabular-nums text-zinc-900 dark:text-white">
                  {score.away} <span className="text-2xl">:</span> {score.home}
                </p>
              ) : (
                <p className="text-3xl font-bold tracking-widest text-zinc-300 dark:text-zinc-600">VS</p>
              )}
            </div>
            <Team name={NATIONAL_TEAMS[game.homeTeam]} side="홈" korea={game.homeTeam === "KOR"} />
          </div>
        </div>
      </section>

      {live && (
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">실시간 현황</p>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500 dark:bg-red-950/50">
              {live.inning}회 {live.inningHalf}
            </span>
          </div>
          <div className="space-y-4 px-5 py-5">
            <div className="flex items-center justify-center gap-4 text-xs">
              <span><b className="text-red-500">공격</b> {live.inningHalf === "초" ? NATIONAL_TEAMS[game.awayTeam] : NATIONAL_TEAMS[game.homeTeam]}</span>
              <span className="text-zinc-300 dark:text-zinc-600">|</span>
              <span><b className="text-blue-500">수비</b> {live.inningHalf === "초" ? NATIONAL_TEAMS[game.homeTeam] : NATIONAL_TEAMS[game.awayTeam]}</span>
            </div>
            <BatterPitcherInfo pitcher={live.pitcher} batter={live.batter} awayFirst={live.inningHalf === "초"} />
            <div className="flex items-center justify-center gap-6">
              <BaseballDiamond bases={live.bases} />
              <SBOCount ballCount={live.ballCount} />
            </div>
            <p className="text-center text-[11px] text-zinc-400">공식 기록 · 10초마다 자동 갱신</p>
          </div>
        </section>
      )}

      {error && !isTerminal(status) && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
          공식 실시간 기록을 일시적으로 불러오지 못했습니다. 마지막 정상 데이터를 표시합니다.
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">경기 정보</p>
        </div>
        <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <Info label="날짜" value={game.date} />
          <Info label="시작 시간" value={`${game.startTime} (한국시간)`} />
          <Info label="라운드" value={game.round} />
          <Info label="경기장" value={game.stadium} />
          <div className="flex items-center justify-between px-5 py-3.5">
            <dt className="text-sm text-zinc-400">데이터</dt>
            <dd><a href={ASIAN_GAMES_SOURCE} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400">공식 기록 확인 ↗</a></dd>
          </div>
        </dl>
        {data?.updatedAt && (
          <p className="border-t border-zinc-100 px-5 py-3 text-right text-[11px] text-zinc-400 dark:border-zinc-800">
            최근 확인 {new Date(data.updatedAt).toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        )}
      </section>
    </div>
  );
}

function Team({ name, side, korea }: { name: string; side: string; korea: boolean }) {
  return (
    <div className="flex-1 text-center">
      <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${korea ? "text-blue-600 dark:text-blue-400" : "text-zinc-500"}`}>{side}</p>
      <p className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{name}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-3.5">
      <dt className="shrink-0 text-sm text-zinc-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</dd>
    </div>
  );
}

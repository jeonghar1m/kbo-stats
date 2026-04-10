"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { LiveGameResponse, LiveGameData } from "@/lib/types";
import { BaseballDiamond } from "./game-live/baseball-diamond";
import { SBOCount } from "./game-live/sbo-count";
import { BatterPitcherInfo } from "./game-live/batter-pitcher-info";

const POLL_INTERVAL = 10_000;

export function LiveGameState({
  gameId,
  homeTeam,
  awayTeam,
}: {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
}) {
  const [data, setData] = useState<LiveGameData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/game-live?g_id=${encodeURIComponent(gameId)}`
      );
      if (!res.ok) {
        setError(true);
        return;
      }
      const json: LiveGameResponse = await res.json();
      if (!json.available) {
        setData(null);
        setError(false);
        return;
      }
      setData(json);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              실시간 현황
            </p>
          </div>
        </div>
        <div className="px-5 py-12 flex justify-center">
          <div className="animate-pulse text-sm text-zinc-400">
            데이터 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    if (error) {
      return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 text-center text-sm text-zinc-400">
          실시간 데이터를 불러올 수 없습니다.
        </div>
      );
    }
    return null;
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              실시간 현황
            </p>
          </div>
          <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full">
            {data.inning}회 {data.inningHalf}
          </span>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Offense / Defense teams */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-red-500 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded">
              공격
            </span>
            <span className="font-bold text-zinc-700 dark:text-zinc-200">
              {data.inningHalf === "초" ? awayTeam : homeTeam}
            </span>
          </span>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
              수비
            </span>
            <span className="font-bold text-zinc-700 dark:text-zinc-200">
              {data.inningHalf === "초" ? homeTeam : awayTeam}
            </span>
          </span>
        </div>

        {/* Batter / Pitcher */}
        <BatterPitcherInfo pitcher={data.pitcher} batter={data.batter} awayFirst={data.inningHalf === "초"} />

        {/* Diamond + SBO side by side */}
        <div className="flex items-center justify-center gap-6">
          <BaseballDiamond bases={data.bases} />
          <SBOCount ballCount={data.ballCount} />
        </div>
      </div>
    </div>
  );
}

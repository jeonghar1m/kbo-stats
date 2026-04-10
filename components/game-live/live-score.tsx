"use client";

import { useState, useEffect, useRef } from "react";
import type { LiveGameResponse } from "@/lib/types";

const POLL_INTERVAL = 2 * 60 * 1000; // 2분

export function LiveScore({
  gameId,
  initialScore,
  isLive,
  isFinished,
}: {
  gameId: string;
  initialScore: { away: number; home: number };
  isLive: boolean;
  isFinished: boolean;
}) {
  const [score, setScore] = useState(initialScore);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLive) return;

    const fetchScore = async () => {
      try {
        const res = await fetch(`/api/game-live?g_id=${encodeURIComponent(gameId)}`);
        if (!res.ok) return;
        const json: LiveGameResponse = await res.json();
        if (json.available) {
          setScore(json.score);
        }
      } catch {
        // 실패 시 기존 점수 유지
      }
    };

    intervalRef.current = setInterval(fetchScore, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameId, isLive]);

  const awayWin = isFinished && score.away > score.home;
  const homeWin = isFinished && score.home > score.away;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-5xl font-mono font-black tabular-nums ${
          awayWin ? "text-red-500" : "text-zinc-900 dark:text-white"
        }`}
      >
        {score.away}
      </span>
      <span className="text-2xl text-zinc-900 dark:text-white">:</span>
      <span
        className={`text-5xl font-mono font-black tabular-nums ${
          homeWin ? "text-red-500" : "text-zinc-900 dark:text-white"
        }`}
      >
        {score.home}
      </span>
    </div>
  );
}

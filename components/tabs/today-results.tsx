"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Game } from "@/lib/types";
import { GameCard } from "@/components/game-card";
import { GameCardSkeleton } from "@/components/game-card-skeleton";
import { DatePicker } from "@/components/date-picker";

export function TodayResults({
  initialGames,
  initialDate,
}: {
  initialGames: Game[];
  initialDate: string;
}) {
  const todayKST = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const [date, setDate] = useState(initialDate);
  const [fetchResult, setFetchResult] = useState<{ date: string; games: Game[] } | null>(null);
  const games = fetchResult?.date === date ? fetchResult.games : initialGames;
  const [loading, startTransition] = useTransition();

  function handleDateChange(value: string) {
    setDate(value);
    if (value === initialDate) return;
    startTransition(async () => {
      const res = await fetch(`/api/games?date=${value}`).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : {};
      setFetchResult({ date: value, games: data.games ?? [] });
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DatePicker value={date} onChange={handleDateChange} />
        <button
          type="button"
          disabled={date === todayKST}
          onClick={() => handleDateChange(todayKST)}
          className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          오늘
        </button>
        {loading && (
          <span className="text-sm text-zinc-400">불러오는 중...</span>
        )}
      </div>

      {!loading && games.length === 0 && (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <p className="text-4xl mb-3">⚾</p>
          <p className="text-lg font-medium">해당 날짜에 경기가 없습니다</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))
          : games.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}?date=${date}`}
                className="block transition-transform hover:-translate-y-0.5 hover:shadow-md rounded-xl"
              >
                <GameCard game={game} />
              </Link>
            ))}
      </div>
    </div>
  );
}

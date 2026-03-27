"use client";

import { useState, useEffect } from "react";
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
  const [date, setDate] = useState(initialDate);
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date === initialDate) {
      setGames(initialGames);
      return;
    }

    setLoading(true);
    fetch(`/api/games?date=${date}`)
      .then((res) => res.json())
      .then((data) => setGames(data.games ?? []))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [date, initialDate, initialGames]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DatePicker
            value={date}
            onChange={setDate}
            max={new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })}
          />
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

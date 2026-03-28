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
  const todayKST = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const [date, setDate] = useState(initialDate);
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState(false);
  const [showFutureModal, setShowFutureModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showFutureModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showFutureModal]);

  function handleDateChange(value: string) {
    if (value > todayKST) {
      setShowFutureModal(true);
      return;
    }
    setDate(value);
  }

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
      {showFutureModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowFutureModal(false)}
        >
          <div
            className="mx-4 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-2xl mb-2">⚾</p>
            <p className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
              미래 날짜는 선택할 수 없어요
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
              오늘({todayKST}) 이전 날짜를 선택해 주세요.
            </p>
            <button
              onClick={() => setShowFutureModal(false)}
              className="w-full rounded-xl bg-zinc-800 dark:bg-zinc-700 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              확인
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <DatePicker
            value={date}
            onChange={handleDateChange}
            max={todayKST}
          />
        <button
          type="button"
          disabled={date === todayKST}
          onClick={() => handleDateChange(todayKST)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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

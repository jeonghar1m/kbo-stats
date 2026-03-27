"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { GameCard } from "@/components/game-card";
import { GameCardSkeleton } from "@/components/game-card-skeleton";
import { DatePicker } from "@/components/date-picker";

const gameSchema = z.object({
  games: z.array(
    z.object({
      id: z.string(),
      homeTeam: z.string(),
      awayTeam: z.string(),
      homeScore: z.number().nullable(),
      awayScore: z.number().nullable(),
      status: z.string(),
      stadium: z.string(),
      startTime: z.string(),
      homePitcher: z.string(),
      awayPitcher: z.string(),
      summary: z.string(),
    })
  ),
  overallSummary: z.string(),
});

function getToday() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  )
    .toISOString()
    .split("T")[0];
}

export function Realtime() {
  const [date, setDate] = useState(getToday());
  const { object, submit, isLoading, error } = useObject({
    api: "/api/games",
    schema: gameSchema,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DatePicker value={date} onChange={setDate} />
        <button
          type="button"
          onClick={() => submit({ date })}
          disabled={isLoading}
          className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          {isLoading ? "분석 중..." : "AI 분석 시작"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          오류가 발생했습니다. 다시 시도해주세요.
        </div>
      )}

      {/* Overall summary */}
      {object?.overallSummary && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300">
          <p className="font-medium text-zinc-900 dark:text-white mb-1">
            📊 AI 분석 요약
          </p>
          <p>{object.overallSummary}</p>
        </div>
      )}

      {/* Game cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading && !object?.games?.length
          ? Array.from({ length: 5 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))
          : object?.games?.map((game, i) => {
              if (!game?.homeTeam || !game?.awayTeam) {
                return <GameCardSkeleton key={i} />;
              }
              return (
                <div key={game.id ?? i} className="space-y-2">
                  <GameCard
                    game={{
                      id: game.id ?? `stream-${i}`,
                      date: date,
                      startTime: game.startTime ?? "",
                      stadium: game.stadium ?? "",
                      homeTeam: game.homeTeam,
                      awayTeam: game.awayTeam,
                      homePitcher: game.homePitcher ?? "",
                      awayPitcher: game.awayPitcher ?? "",
                      winPitcher: "",
                      losePitcher: "",
                      savePitcher: "",
                      status: (game.status as "FINISHED") ?? "SCHEDULED",
                      score: {
                        home: game.homeScore ?? 0,
                        away: game.awayScore ?? 0,
                      },
                      currentInning: 0,
                      broadcastServices: [],
                      season: 0,
                    }}
                  />
                  {game.summary && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 px-2">
                      💬 {game.summary}
                    </p>
                  )}
                </div>
              );
            })}
      </div>

      {!isLoading && !object && (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <p className="text-4xl mb-3">🔄</p>
          <p className="text-lg font-medium">
            &quot;AI 분석 시작&quot; 버튼을 눌러 경기 데이터를 분석해보세요
          </p>
          <p className="text-sm mt-2">
            AI가 각 경기를 분석하고 요약을 생성합니다
          </p>
        </div>
      )}
    </div>
  );
}

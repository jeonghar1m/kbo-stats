"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { GameCard } from "@/components/game-card";
import { GameCardSkeleton } from "@/components/game-card-skeleton";
import { DatePicker } from "@/components/date-picker";
import { getTeamColor } from "@/lib/team-colors";

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

type RealtimeGame = NonNullable<z.infer<typeof gameSchema>["games"]>[number];

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "예정",
  IN_PROGRESS: "진행 중",
  FINISHED: "종료",
  CANCELED: "취소",
};

function GameDetail({
  game,
  date,
  onBack,
}: {
  game: RealtimeGame;
  date: string;
  onBack: () => void;
}) {
  const homeColor = getTeamColor(game.homeTeam ?? "");
  const awayColor = getTeamColor(game.awayTeam ?? "");
  const isFinished = game.status === "FINISHED";
  const homeWin = isFinished && (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWin = isFinished && (game.awayScore ?? 0) > (game.homeScore ?? 0);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        ← 목록으로
      </button>

      {/* Header */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{game.stadium ?? ""}</span>
          <span className="flex items-center gap-1.5">
            {game.status === "IN_PROGRESS" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
            {STATUS_LABEL[game.status ?? ""] ?? game.status}
          </span>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{date}</p>

          {/* Score display */}
          <div className="flex items-center justify-between gap-4">
            {/* Away */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-2 h-12 rounded-full"
                style={{ backgroundColor: awayColor.primary }}
              />
              <span
                className={`text-xl font-bold ${
                  awayWin
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {game.awayTeam}
              </span>
              {game.awayPitcher?.trim() && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {game.awayPitcher.trim()}
                </span>
              )}
            </div>

            {/* Scores */}
            <div className="flex items-center gap-4">
              <span
                className={`text-5xl font-mono font-bold tabular-nums ${
                  awayWin
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {game.status === "SCHEDULED" ? "-" : game.awayScore ?? 0}
              </span>
              <span className="text-2xl text-zinc-300 dark:text-zinc-600 font-light">:</span>
              <span
                className={`text-5xl font-mono font-bold tabular-nums ${
                  homeWin
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {game.status === "SCHEDULED" ? "-" : game.homeScore ?? 0}
              </span>
            </div>

            {/* Home */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-2 h-12 rounded-full"
                style={{ backgroundColor: homeColor.primary }}
              />
              <span
                className={`text-xl font-bold ${
                  homeWin
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {game.homeTeam}
              </span>
              {game.homePitcher?.trim() && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {game.homePitcher.trim()}
                </span>
              )}
            </div>
          </div>

          {/* Start time */}
          {game.startTime && (
            <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
              {game.startTime}
            </p>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {game.summary && (
        <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300">
          <p className="font-medium text-zinc-900 dark:text-white mb-2">
            💬 AI 경기 분석
          </p>
          <p className="leading-relaxed">{game.summary}</p>
        </div>
      )}
    </div>
  );
}

function getToday() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  )
    .toISOString()
    .split("T")[0];
}

export function Realtime() {
  const [date, setDate] = useState(getToday());
  const [selectedGame, setSelectedGame] = useState<RealtimeGame | null>(null);
  const { object, submit, isLoading, error } = useObject({
    api: "/api/games",
    schema: gameSchema,
  });

  if (selectedGame) {
    return (
      <GameDetail
        game={selectedGame}
        date={date}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

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
                    onClick={() => setSelectedGame(game as RealtimeGame)}
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

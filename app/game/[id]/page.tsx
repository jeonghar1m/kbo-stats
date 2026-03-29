import Link from "next/link";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { fetchGames, createKSTDate } from "@/lib/kbo";
import { getTeamColor } from "@/lib/team-colors";
import { LiveGameState } from "@/components/live-game-state";
import type { Game } from "@/lib/types";

const STATUS_LABEL: Record<Game["status"], string> = {
  SCHEDULED: "예정",
  IN_PROGRESS: "진행 중",
  FINISHED: "종료",
  CANCELED: "취소",
};

export default async function GameDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { id } = await params;
  const { date: dateStr } = await searchParams;

  const date = createKSTDate(dateStr ?? undefined);
  const games = await fetchGames(date);
  const game = games.find((g) => g.id === id);

  if (!game) notFound();

  const homeColor = getTeamColor(game.homeTeam);
  const awayColor = getTeamColor(game.awayTeam);
  const isFinished = game.status === "FINISHED";
  const isLive = game.status === "IN_PROGRESS";
  const isCanceled = game.status === "CANCELED";
  const homeWin = isFinished && game.score.home > game.score.away;
  const awayWin = isFinished && game.score.home < game.score.away;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 text-white py-4 px-4 dark:bg-zinc-950">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href={dateStr ? `/?date=${dateStr}` : "/"}
            className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            ← 목록
          </Link>
          <h1 className="text-xl font-bold tracking-tight">⚾ 경기 상세</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Score card */}
        <div className="rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {/* Team color bar */}
          <div className="flex h-1.5">
            <div className="flex-1" style={{ backgroundColor: awayColor.primary }} />
            <div className="flex-1" style={{ backgroundColor: homeColor.primary }} />
          </div>

          <div className="px-6 py-8">
            {/* Status badge */}
            <div className="flex justify-center mb-6">
              {isLive ? (
                <span className="inline-flex items-center gap-2 text-red-500 font-semibold text-sm bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  LIVE · {game.currentInning}회{game.inningHalf ? ` ${game.inningHalf}` : ""}
                </span>
              ) : (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isFinished
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                      : isCanceled
                      ? "bg-red-50 dark:bg-red-950/50 text-red-500"
                      : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {STATUS_LABEL[game.status]}
                </span>
              )}
            </div>

            {/* Teams & Score */}
            <div className="flex items-center justify-between gap-2">
              {/* Away team */}
              <div className="flex-1 text-center">
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70"
                  style={{ color: awayColor.primary }}
                >
                  원정
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {game.awayTeam}
                </p>
                {game.awayPitcher?.trim() && (
                  <p className="text-xs text-zinc-400 mt-1.5">
                    선발 {game.awayPitcher.trim()}
                  </p>
                )}
              </div>

              {/* Score */}
              <div className="text-center px-2">
                {game.status === "SCHEDULED" ? (
                  <p className="text-3xl font-bold text-zinc-300 dark:text-zinc-600 tracking-widest">
                    VS
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-5xl font-mono font-black tabular-nums ${
                        awayWin ? "text-red-500" : "text-zinc-900 dark:text-white"
                      }`}
                    >
                      {game.score.away}
                    </span>
                    <span className="text-2xl text-zinc-200 dark:text-zinc-700">
                      :
                    </span>
                    <span
                      className={`text-5xl font-mono font-black tabular-nums ${
                        homeWin ? "text-red-500" : "text-zinc-900 dark:text-white"
                      }`}
                    >
                      {game.score.home}
                    </span>
                  </div>
                )}
              </div>

              {/* Home team */}
              <div className="flex-1 text-center">
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70"
                  style={{ color: homeColor.primary }}
                >
                  홈
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {game.homeTeam}
                </p>
                {game.homePitcher?.trim() && (
                  <p className="text-xs text-zinc-400 mt-1.5">
                    선발 {game.homePitcher.trim()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live game state */}
        {isLive && (
          <LiveGameState
            gameId={game.id}
            homeTeam={game.homeTeam}
            awayTeam={game.awayTeam}
          />
        )}

        {/* Pitcher results */}
        {isFinished && (game.winPitcher.trim() || game.losePitcher.trim()) && (
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                투수 기록
              </p>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {game.winPitcher.trim() && (
                <div className="px-5 py-3.5 flex justify-between items-center">
                  <span className="text-sm text-zinc-400 flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold shrink-0">
                      승
                    </span>
                    승리투수
                  </span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {game.winPitcher.trim()}
                  </span>
                </div>
              )}
              {game.losePitcher.trim() && (
                <div className="px-5 py-3.5 flex justify-between items-center">
                  <span className="text-sm text-zinc-400 flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs flex items-center justify-center font-bold shrink-0">
                      패
                    </span>
                    패전투수
                  </span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {game.losePitcher.trim()}
                  </span>
                </div>
              )}
              {game.savePitcher.trim() && (
                <div className="px-5 py-3.5 flex justify-between items-center">
                  <span className="text-sm text-zinc-400 flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 text-xs flex items-center justify-center font-bold shrink-0">
                      세
                    </span>
                    세이브
                  </span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {game.savePitcher.trim()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game info */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              경기 정보
            </p>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="px-5 py-3.5 flex justify-between items-center">
              <span className="text-sm text-zinc-400">날짜</span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {dayjs(game.date).format("YYYY년 MM월 DD일")}
              </span>
            </div>
            <div className="px-5 py-3.5 flex justify-between items-center">
              <span className="text-sm text-zinc-400">시작 시간</span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {game.startTime || "-"}
              </span>
            </div>
            <div className="px-5 py-3.5 flex justify-between items-center">
              <span className="text-sm text-zinc-400">경기장</span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {game.stadium}
              </span>
            </div>
            {game.season > 0 && (
              <div className="px-5 py-3.5 flex justify-between items-center">
                <span className="text-sm text-zinc-400">시즌</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {game.season}년
                </span>
              </div>
            )}
            {game.broadcastServices.length > 0 && (
              <div className="px-5 py-3.5 flex justify-between items-center">
                <span className="text-sm text-zinc-400">중계</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {game.broadcastServices.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

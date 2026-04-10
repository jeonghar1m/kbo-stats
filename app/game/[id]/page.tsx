import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGames, createKSTDate } from "@/lib/kbo";
import { getTeamColor } from "@/lib/team-colors";
import { LiveGameState } from "@/components/live-game-state";
import { ScoreCard } from "@/components/game-detail/score-card";
import { GameInfoCard } from "@/components/game-detail/game-info-card";

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
        <ScoreCard
          game={game}
          homeColor={homeColor}
          awayColor={awayColor}
          isLive={isLive}
          isFinished={isFinished}
        />

        {isLive && (
          <LiveGameState
            gameId={game.id}
            homeTeam={game.homeTeam}
            awayTeam={game.awayTeam}
          />
        )}

        <GameInfoCard game={game} isFinished={isFinished} isCanceled={isCanceled} />
      </div>
    </main>
  );
}

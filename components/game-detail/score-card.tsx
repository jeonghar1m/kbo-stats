import { LiveScore } from "@/components/game-live/live-score";
import type { Game } from "@/lib/types";
import type { getTeamColor } from "@/lib/team-colors";

type TeamColor = ReturnType<typeof getTeamColor>;

interface ScoreCardProps {
  game: Game;
  homeColor: TeamColor;
  awayColor: TeamColor;
  isLive: boolean;
  isFinished: boolean;
}

export function ScoreCard({
  game,
  homeColor,
  awayColor,
  isLive,
  isFinished,
}: ScoreCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      {/* Team color bar */}
      <div className="flex h-1.5">
        <div className="flex-1" style={{ backgroundColor: awayColor.primary }} />
        <div className="flex-1" style={{ backgroundColor: homeColor.primary }} />
      </div>

      <div className="px-6 py-8">
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
              <LiveScore
                gameId={game.id}
                initialScore={game.score}
                isLive={isLive}
                isFinished={isFinished}
              />
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
  );
}

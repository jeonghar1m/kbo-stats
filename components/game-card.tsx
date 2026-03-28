import type { Game } from "@/lib/types";
import { getTeamColor } from "@/lib/team-colors";

const STATUS_LABEL: Record<Game["status"], string> = {
  SCHEDULED: "예정",
  IN_PROGRESS: "진행 중",
  FINISHED: "종료",
  CANCELED: "취소",
};

export function GameCard({ game, onClick }: { game: Game; onClick?: () => void }) {
  const homeColor = getTeamColor(game.homeTeam);
  const awayColor = getTeamColor(game.awayTeam);
  const isFinished = game.status === "FINISHED";
  const isLive = game.status === "IN_PROGRESS";

  const homeWin = isFinished && game.score.home > game.score.away;
  const awayWin = isFinished && game.score.home < game.score.away;

  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900${onClick ? " cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors" : ""}`}
      onClick={onClick}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{game.stadium}</span>
        <span className="flex items-center gap-1.5">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
          {isLive
            ? `${game.inningHalf ? `${game.inningHalf} ` : ""}${game.currentInning}회`
            : STATUS_LABEL[game.status]}
          {game.status === "SCHEDULED" && ` ${game.startTime}`}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="p-4 space-y-3">
        {/* Away team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: awayColor.primary }}
            />
            <div>
              <span
                className={`text-lg font-bold ${
                  awayWin
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {game.awayTeam}
              </span>
              {game.awayPitcher?.trim() && (
                <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
                  {game.awayPitcher.trim()}
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-2xl font-mono font-bold tabular-nums ${
              awayWin
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {game.status === "SCHEDULED" ? "-" : game.score.away}
          </span>
        </div>

        {/* Home team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: homeColor.primary }}
            />
            <div>
              <span
                className={`text-lg font-bold ${
                  homeWin
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {game.homeTeam}
              </span>
              {game.homePitcher?.trim() && (
                <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
                  {game.homePitcher.trim()}
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-2xl font-mono font-bold tabular-nums ${
              homeWin
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {game.status === "SCHEDULED" ? "-" : game.score.home}
          </span>
        </div>
      </div>

      {/* Pitcher info for finished games */}
      {isFinished &&
        (game.winPitcher.trim() || game.losePitcher.trim()) && (
          <div className="px-4 pb-3 flex gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            {game.winPitcher.trim() && <span>승 {game.winPitcher.trim()}</span>}
            {game.losePitcher.trim() && <span>패 {game.losePitcher.trim()}</span>}
            {game.savePitcher.trim() && <span>세 {game.savePitcher.trim()}</span>}
          </div>
        )}
    </div>
  );
}

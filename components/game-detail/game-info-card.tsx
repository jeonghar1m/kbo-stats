import dayjs from "dayjs";
import type { Game } from "@/lib/types";

interface GameInfoCardProps {
  game: Game;
  isFinished: boolean;
  isCanceled: boolean;
}

export function GameInfoCard({ game, isFinished, isCanceled }: GameInfoCardProps) {
  const hasPitcherResult =
    isFinished && (game.winPitcher.trim() || game.losePitcher.trim());

  return (
    <>
      {/* Pitcher results */}
      {hasPitcherResult && (
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
          {isCanceled && game.cancellationReason && (
            <div className="px-5 py-3.5 flex justify-between items-center">
              <span className="text-sm text-zinc-400">취소 사유</span>
              <span className="text-sm font-medium text-red-500">
                {game.cancellationReason}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

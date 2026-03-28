"use client";

export function BatterPitcherInfo({
  pitcher,
  batter,
}: {
  pitcher: string;
  batter: string;
}) {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
          투수
        </span>
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
          {pitcher || "-"}
        </span>
      </div>

      <span className="text-zinc-300 dark:text-zinc-600">|</span>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
          타자
        </span>
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
          {batter || "-"}
        </span>
      </div>
    </div>
  );
}

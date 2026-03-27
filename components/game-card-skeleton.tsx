export function GameCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50">
        <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
          <div className="h-7 w-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
          <div className="h-7 w-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
}

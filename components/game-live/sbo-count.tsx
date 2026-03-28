"use client";

import type { BallCount } from "@/lib/types";

function CountDots({
  label,
  count,
  max,
  activeColor,
}: {
  label: string;
  count: number;
  max: number;
  activeColor: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-bold text-zinc-400 w-3">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < count ? activeColor : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function SBOCount({ ballCount }: { ballCount: BallCount }) {
  return (
    <div className="flex gap-5">
      <CountDots
        label="B"
        count={ballCount.balls}
        max={4}
        activeColor="bg-green-500"
      />
      <CountDots
        label="S"
        count={ballCount.strikes}
        max={3}
        activeColor="bg-amber-400"
      />
      <CountDots
        label="O"
        count={ballCount.outs}
        max={3}
        activeColor="bg-red-500"
      />
    </div>
  );
}

"use client";

// Simplified diamond showing base occupancy only
// Home plate at bottom, 2B at top

function BaseShape({
  x,
  y,
  occupied,
}: {
  x: number;
  y: number;
  occupied: boolean;
}) {
  return (
    <rect
      x={x - 10}
      y={y - 10}
      width={20}
      height={20}
      transform={`rotate(45 ${x} ${y})`}
      className={
        occupied
          ? "fill-amber-400 stroke-amber-500"
          : "fill-zinc-100 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-600"
      }
      strokeWidth={2}
    />
  );
}

export function BaseballDiamond({
  bases,
}: {
  bases: { first: boolean; second: boolean; third: boolean };
}) {
  // viewBox: 0 0 160 130
  // Home: 80, 120 | 1B: 130, 70 | 2B: 80, 20 | 3B: 30, 70
  return (
    <div className="w-28 mx-auto">
      <svg viewBox="0 0 160 130" className="w-full h-auto">
        {/* Base paths */}
        <line x1={80} y1={120} x2={130} y2={70} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth={1.5} />
        <line x1={130} y1={70} x2={80} y2={20} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth={1.5} />
        <line x1={80} y1={20} x2={30} y2={70} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth={1.5} />
        <line x1={30} y1={70} x2={80} y2={120} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth={1.5} />

        {/* Home plate */}
        <polygon
          points="75,117 80,123 85,117 85,114 75,114"
          className="fill-white dark:fill-zinc-300 stroke-zinc-400"
          strokeWidth={1}
        />

        {/* Bases */}
        <BaseShape x={130} y={70} occupied={bases.first} />
        <BaseShape x={80} y={20} occupied={bases.second} />
        <BaseShape x={30} y={70} occupied={bases.third} />
      </svg>
    </div>
  );
}

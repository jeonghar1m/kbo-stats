"use client";

export function DatePicker({
  value,
  onChange,
  max,
}: {
  value: string;
  onChange: (date: string) => void;
  max?: string;
}) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      max={max}
      className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
    />
  );
}

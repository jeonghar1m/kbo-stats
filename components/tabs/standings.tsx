"use client";

import { useState, useEffect } from "react";
import type { TeamStanding } from "@/lib/standings";
import { getTeamColor } from "@/lib/team-colors";

export function Standings() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/standings")
      .then((res) => res.json())
      .then((data) => setStandings(data))
      .catch(() => setStandings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <p className="text-center text-zinc-500 dark:text-zinc-400 py-12">
        순위 데이터를 불러올 수 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
            <th className="text-center pb-3 pr-3 w-8 whitespace-nowrap">순위</th>
            <th className="text-center pb-3 pr-4">팀</th>
            <th className="text-center pb-3 px-2">경기</th>
            <th className="text-center pb-3 px-2">승</th>
            <th className="text-center pb-3 px-2">패</th>
            <th className="text-center pb-3 px-2">무</th>
            <th className="text-center pb-3 px-2">승률</th>
            <th className="text-center pb-3 px-2">게임차</th>
            <th className="text-center pb-3 px-2 hidden sm:table-cell">
              최근10경기
            </th>
            <th className="text-center pb-3 pl-2 hidden sm:table-cell">연속</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const color = getTeamColor(s.team);
            const isTop5 = s.rank <= 5;
            return (
              <tr
                key={i}
                className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
              >
                <td className="py-3 pr-3 text-center">
                  <span
                    className={`text-sm font-bold ${
                      isTop5
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {s.rank}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color.primary }}
                    />
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {s.team}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center text-zinc-600 dark:text-zinc-300">
                  {s.games}
                </td>
                <td className="py-3 px-2 text-center font-medium text-zinc-900 dark:text-white">
                  {s.wins}
                </td>
                <td className="py-3 px-2 text-center text-zinc-600 dark:text-zinc-300">
                  {s.losses}
                </td>
                <td className="py-3 px-2 text-center text-zinc-600 dark:text-zinc-300">
                  {s.draws}
                </td>
                <td className="py-3 px-2 text-center font-medium text-zinc-900 dark:text-white">
                  {s.winRate}
                </td>
                <td className="py-3 px-2 text-center text-zinc-600 dark:text-zinc-300">
                  {s.gamesBehind}
                </td>
                <td className="py-3 px-2 text-center text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">
                  {s.last10}
                </td>
                <td className="py-3 pl-2 text-center text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">
                  {s.streak}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

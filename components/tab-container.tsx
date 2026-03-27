"use client";

import { useState } from "react";
import type { Game } from "@/lib/types";
import { TodayResults } from "@/components/tabs/today-results";
import { AiChat } from "@/components/tabs/ai-chat";
import { Realtime } from "@/components/tabs/realtime";

const TABS = [
  { id: "results", label: "오늘 경기 결과" },
  { id: "ai", label: "AI" },
  { id: "realtime", label: "실시간" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TabContainer({
  initialGames,
  initialDate,
}: {
  initialGames: Game[];
  initialDate: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("results");

  return (
    <div>
      {/* Tab bar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === "results" && (
          <TodayResults
            initialGames={initialGames}
            initialDate={initialDate}
          />
        )}
        {activeTab === "ai" && <AiChat />}
        {activeTab === "realtime" && <Realtime />}
      </div>
    </div>
  );
}

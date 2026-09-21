import Link from "next/link";
import { notFound } from "next/navigation";
import { AsianGameDetail } from "@/components/asian-game-detail";
import { ASIAN_GAMES } from "@/lib/asian-games";
import { fetchAsianGameLive } from "@/lib/asian-games-api";

export default async function AsianGameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = ASIAN_GAMES.find((item) => item.id === id);
  if (!game) notFound();

  const initialData = await fetchAsianGameLive(game);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-zinc-900 px-4 py-4 text-white dark:bg-zinc-950">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link
            href={`/?competition=asian-games&date=${game.date}`}
            className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← 목록
          </Link>
          <h1 className="text-xl font-bold tracking-tight">⚾ 아시안게임 경기 상세</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <AsianGameDetail
          game={game}
          initialData={initialData}
          now={new Date().getTime()}
        />
      </div>
    </main>
  );
}

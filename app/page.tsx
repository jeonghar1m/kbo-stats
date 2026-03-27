import { fetchGames, createKSTDate } from "@/lib/kbo";
import { TabContainer } from "@/components/tab-container";

export default async function Home() {
  const today = createKSTDate();
  const todayStr = today.toISOString().split("T")[0];

  let games: Awaited<ReturnType<typeof fetchGames>>;
  try {
    games = await fetchGames(today);
  } catch {
    games = [];
  }

  return (
    <main className="min-h-screen">
      <header className="bg-zinc-900 text-white py-4 px-4 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight">⚾ KBO 경기 결과</h1>
        </div>
      </header>
      <TabContainer initialGames={games} initialDate={todayStr} />
    </main>
  );
}

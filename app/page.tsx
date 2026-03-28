import { fetchGames, createKSTDate } from "@/lib/kbo";
import TabContainer from "@/components/tab-container";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const todayKST = createKSTDate();
  const todayStr = todayKST.toISOString().split("T")[0];

  const requestedDate = dateParam && dateParam <= todayStr ? dateParam : todayStr;
  const date = createKSTDate(requestedDate);

  let games: Awaited<ReturnType<typeof fetchGames>>;
  try {
    games = await fetchGames(date);
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
      <TabContainer initialGames={games} initialDate={requestedDate} />
    </main>
  );
}

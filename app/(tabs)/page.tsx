import { fetchGames, createKSTDate } from "@/lib/kbo";
import { TodayResults } from "@/components/tabs/today-results";

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

  return <TodayResults initialGames={games} initialDate={requestedDate} />;
}

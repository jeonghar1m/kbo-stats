import { fetchGames, createKSTDate } from "@/lib/kbo";
import { CompetitionNav } from "@/components/competition-nav";
import { AsianGames } from "@/components/tabs/asian-games";
import { TodayResults } from "@/components/tabs/today-results";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; competition?: string }>;
}) {
  const { date: dateParam, competition } = await searchParams;

  if (competition === "asian-games") {
    return (
      <>
        <CompetitionNav asianGames />
        <AsianGames date={typeof dateParam === "string" ? dateParam : undefined} now={new Date().getTime()} />
      </>
    );
  }
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
    <>
      <CompetitionNav />
      <TodayResults initialGames={games} initialDate={requestedDate} />
    </>
  );
}

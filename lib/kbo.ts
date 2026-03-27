import type { Game } from "./types";

export async function fetchGames(date: Date): Promise<Game[]> {
  try {
    const { getGame } = await import("kbo-game");
    const games = await getGame(date);
    if (!games) return [];
    return JSON.parse(JSON.stringify(games));
  } catch {
    return [];
  }
}

export function createKSTDate(dateString?: string): Date {
  if (!dateString) {
    const now = new Date();
    const kst = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    return kst;
  }
  return new Date(`${dateString}T00:00:00Z`);
}

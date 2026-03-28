import type { Game } from "./types";

function formatDateKBO(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

async function fetchInningHalfMap(
  dateStr: string
): Promise<Record<string, string>> {
  try {
    const formData = new URLSearchParams({
      leId: "1",
      srId: "0,1,3,4,5,6,7,8,9",
      date: dateStr,
    });
    const res = await fetch(
      "https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://www.koreabaseball.com",
          Referer: "https://www.koreabaseball.com/",
        },
        body: formData,
      }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const games: Array<{ G_ID: string; GAME_TB_SC_NM: string }> =
      data.game ?? [];
    return Object.fromEntries(
      games.map((g) => [g.G_ID, g.GAME_TB_SC_NM])
    );
  } catch {
    return {};
  }
}

export async function fetchGames(date: Date): Promise<Game[]> {
  try {
    const { getGame } = await import("kbo-game");
    const dateStr = formatDateKBO(date);
    const [games, inningHalfMap] = await Promise.all([
      getGame(date),
      fetchInningHalfMap(dateStr),
    ]);
    if (!games) return [];
    const serialized: Game[] = JSON.parse(JSON.stringify(games));
    return serialized.map((game) => ({
      ...game,
      inningHalf: inningHalfMap[game.id] || undefined,
    }));
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

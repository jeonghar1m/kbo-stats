export interface TeamStanding {
  rank: number;
  team: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: string;
  gamesBehind: string;
  last10: string;
  streak: string;
  home: string;
  away: string;
}

const STANDINGS_URL =
  "https://www.koreabaseball.com/Record/TeamRank/TeamRankDaily.aspx";

function extractViewState(html: string): string {
  const match = html.match(/id="__VIEWSTATE"\s+value="([^"]*)"/);
  return match?.[1] ?? "";
}

function parseStandingsTable(html: string): TeamStanding[] {
  // Find the tData table (first one is the standings)
  const tableMatch = html.match(/<table[^>]*class="tData"[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) return [];

  const tableHtml = tableMatch[1];
  const rows = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) ?? [];

  const standings: TeamStanding[] = [];

  for (const row of rows) {
    const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g) ?? [];
    const values = cells.map((cell) =>
      cell
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, "")
        .trim()
    );

    // Header row has "순위" as first cell
    if (values[0] === "순위" || values.length < 12) continue;

    const rank = parseInt(values[0], 10);
    if (isNaN(rank)) continue;

    standings.push({
      rank,
      team: values[1],
      games: parseInt(values[2], 10),
      wins: parseInt(values[3], 10),
      losses: parseInt(values[4], 10),
      draws: parseInt(values[5], 10),
      winRate: values[6],
      gamesBehind: values[7],
      last10: values[8],
      streak: values[9],
      home: values[10],
      away: values[11],
    });
  }

  return standings;
}

export async function fetchStandings(): Promise<TeamStanding[]> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "ko-KR,ko;q=0.9",
  };

  const getRes = await fetch(STANDINGS_URL, { headers, cache: "no-store" });
  if (!getRes.ok) return [];

  const getHtml = await getRes.text();
  const viewState = extractViewState(getHtml);

  const body = new URLSearchParams({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: viewState,
  });

  const postRes = await fetch(STANDINGS_URL, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: STANDINGS_URL,
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!postRes.ok) return [];

  const postHtml = await postRes.text();
  return parseStandingsTable(postHtml);
}

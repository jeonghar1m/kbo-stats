import "server-only";

import { inflateSync } from "node:zlib";
import type { AsianGame } from "./asian-games";
import {
  parseOfficialBaseballResult,
  type OfficialBaseballResult,
} from "./asian-games-live";
import type { AsianGameLiveResponse } from "./types";

const RESULTS_API =
  "https://back.results.asiangames2026.org/s/AG2026/en/BBL/results";

export async function fetchAsianGameLive(
  game: AsianGame,
): Promise<AsianGameLiveResponse> {
  try {
    const response = await fetch(`${RESULTS_API}/${game.resultsKey}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json, text/plain, */*" },
    });
    if (!response.ok) return { available: false };

    const bytes = Buffer.from(await response.arrayBuffer());
    const body = bytes[0] === 0x78
      ? inflateSync(bytes).toString("utf8")
      : bytes.toString("utf8");
    const official = JSON.parse(body) as OfficialBaseballResult;
    const parsed = parseOfficialBaseballResult(
      official,
      game.homeTeam,
      game.awayTeam,
    );
    if (!parsed) return { available: false };

    return {
      available: true,
      ...parsed,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return { available: false };
  }
}

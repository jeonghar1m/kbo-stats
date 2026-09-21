import { inflateSync } from "node:zlib";
import { NextRequest, NextResponse } from "next/server";
import { ASIAN_GAMES } from "@/lib/asian-games";
import {
  parseOfficialBaseballResult,
  type OfficialBaseballResult,
} from "@/lib/asian-games-live";
import type { AsianGameLiveResponse } from "@/lib/types";

const RESULTS_API =
  "https://back.results.asiangames2026.org/s/AG2026/en/BBL/results";

export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get("game_id");
  const game = ASIAN_GAMES.find((item) => item.id === gameId);
  if (!game) {
    return NextResponse.json({ error: "unknown game_id" }, { status: 400 });
  }

  try {
    const response = await fetch(`${RESULTS_API}/${game.resultsKey}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json, text/plain, */*" },
    });
    if (!response.ok) return unavailable();

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
    if (!parsed) return unavailable();

    const result: AsianGameLiveResponse = {
      available: true,
      ...parsed,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(result, { headers: noCacheHeaders() });
  } catch {
    return unavailable();
  }
}

function unavailable() {
  const result: AsianGameLiveResponse = { available: false };
  return NextResponse.json(result, { headers: noCacheHeaders() });
}

function noCacheHeaders() {
  return { "Cache-Control": "no-cache, no-store, must-revalidate" };
}

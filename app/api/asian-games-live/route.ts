import { NextRequest, NextResponse } from "next/server";
import { ASIAN_GAMES } from "@/lib/asian-games";
import { fetchAsianGameLive } from "@/lib/asian-games-api";

export async function GET(request: NextRequest) {
  const gameId = request.nextUrl.searchParams.get("game_id");
  const game = ASIAN_GAMES.find((item) => item.id === gameId);
  if (!game) {
    return NextResponse.json({ error: "unknown game_id" }, { status: 400 });
  }

  const result = await fetchAsianGameLive(game);
  return NextResponse.json(result, { headers: noCacheHeaders() });
}

function noCacheHeaders() {
  return { "Cache-Control": "no-cache, no-store, must-revalidate" };
}

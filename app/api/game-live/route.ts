import { NextRequest, NextResponse } from "next/server";
import type { LiveGameData, LiveGameResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const gId = request.nextUrl.searchParams.get("g_id");
  if (!gId) {
    return NextResponse.json(
      { error: "g_id parameter required" },
      { status: 400 },
    );
  }

  // Extract date from game ID (first 8 chars: YYYYMMDD)
  const dateStr = gId.slice(0, 8);

  try {
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
        body: new URLSearchParams({
          leId: "1",
          srId: "0,1,3,4,5,6,7,8,9",
          date: dateStr,
        }),
      },
    );

    if (!res.ok) {
      return jsonUnavailable();
    }

    const data = await res.json();
    const games: Array<Record<string, unknown>> = data.game ?? [];
    const game = games.find((g) => g.G_ID === gId);

    if (!game || game.GAME_STATE_SC !== "2") {
      return jsonUnavailable();
    }

    const isTop = String(game.GAME_TB_SC_NM ?? "") === "초";
    const result: LiveGameData = {
      available: true,
      pitcher: isTop ? String(game.B_P_NM ?? "").trim() : String(game.T_P_NM ?? "").trim(),
      batter: isTop ? String(game.T_P_NM ?? "").trim() : String(game.B_P_NM ?? "").trim(),
      bases: {
        first: Number(game.B1_BAT_ORDER_NO ?? 0) > 0,
        second: Number(game.B2_BAT_ORDER_NO ?? 0) > 0,
        third: Number(game.B3_BAT_ORDER_NO ?? 0) > 0,
      },
      ballCount: {
        balls: Number(game.BALL_CN ?? 0),
        strikes: Number(game.STRIKE_CN ?? 0),
        outs: Number(game.OUT_CN ?? 0),
      },
      inning: Number(game.GAME_INN_NO ?? 0),
      inningHalf: String(game.GAME_TB_SC_NM ?? ""),
      score: {
        away: Number(game.T_SCORE_CN ?? 0),
        home: Number(game.B_SCORE_CN ?? 0),
      },
    };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-cache, no-store" },
    });
  } catch {
    return jsonUnavailable();
  }
}

function jsonUnavailable() {
  const unavailable: LiveGameResponse = { available: false };
  return NextResponse.json(unavailable, {
    headers: { "Cache-Control": "no-cache, no-store" },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import { fetchGames, createKSTDate } from "@/lib/kbo";

const gameAnalysisSchema = z.object({
  games: z.array(
    z.object({
      id: z.string().describe("경기 고유 ID"),
      homeTeam: z.string().describe("홈팀 이름"),
      awayTeam: z.string().describe("원정팀 이름"),
      homeScore: z.number().nullable().describe("홈팀 점수"),
      awayScore: z.number().nullable().describe("원정팀 점수"),
      status: z.string().describe("경기 상태: SCHEDULED, IN_PROGRESS, FINISHED, CANCELED"),
      stadium: z.string().describe("경기장"),
      startTime: z.string().describe("경기 시작 시간"),
      homePitcher: z.string().describe("홈팀 선발투수"),
      awayPitcher: z.string().describe("원정팀 선발투수"),
      summary: z.string().describe("이 경기에 대한 한줄 요약/분석"),
    })
  ),
  overallSummary: z.string().describe("오늘 전체 경기에 대한 종합 요약"),
});

export { gameAnalysisSchema };

// GET: plain JSON for tab 1 date changes
export async function GET(req: NextRequest) {
  const dateStr = req.nextUrl.searchParams.get("date");
  const date = createKSTDate(dateStr ?? undefined);
  const rawGames = await fetchGames(date);
  return NextResponse.json({ games: rawGames });
}

// POST: AI streaming for tab 3 (useObject sends POST)
export async function POST(req: Request) {
  const body = await req.json();
  const dateStr = body?.date as string | undefined;
  const date = createKSTDate(dateStr ?? undefined);
  const rawGames = await fetchGames(date);

  if (rawGames.length === 0) {
    return NextResponse.json({ games: [], overallSummary: "해당 날짜에 경기가 없습니다." });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY === "your-api-key-here") {
    return NextResponse.json({
      games: rawGames.map((g) => ({
        ...g,
        homeScore: g.score.home,
        awayScore: g.score.away,
        summary: "",
      })),
      overallSummary: "AI 키가 설정되지 않았습니다.",
    });
  }

  const result = streamObject({
    model: google("gemma-4-31b-it"),
    schema: gameAnalysisSchema,
    prompt: `다음은 KBO 프로야구 경기 데이터입니다. 각 경기의 데이터를 그대로 유지하면서, 각 경기에 대한 한줄 요약과 전체 종합 요약을 작성해주세요.
취소된 경기는 "우천 취소" 등으로 요약하고, 종료된 경기는 승패와 주요 포인트를 요약해주세요.

경기 데이터:
${JSON.stringify(rawGames, null, 2)}`,
  });

  return result.toTextStreamResponse();
}

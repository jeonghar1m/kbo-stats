import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { fetchGames, createKSTDate } from "@/lib/kbo";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const todayDate = createKSTDate();
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  const today = todayDate.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const [todayGames, yesterdayGames] = await Promise.all([
    fetchGames(todayDate),
    fetchGames(yesterdayDate),
  ]);

  const result = streamText({
    model: google("gemma-4-31b-it"),
    system: `당신은 KBO 한국 프로야구 전문 AI 어시스턴트입니다.
아래 제공된 경기 데이터를 바탕으로 자연스러운 한국어로 답변해주세요.
오늘은 ${today}입니다.
경기가 없으면 해당 날짜에 예정된 경기가 없다고 안내하세요.

오늘 경기 데이터:
${todayGames.length > 0 ? JSON.stringify(todayGames, null, 2) : "오늘 경기 없음"}

어제 경기 데이터:
${yesterdayGames.length > 0 ? JSON.stringify(yesterdayGames, null, 2) : "어제 경기 없음"}`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

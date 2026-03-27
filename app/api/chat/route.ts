import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { fetchGames, createKSTDate } from "@/lib/kbo";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const today = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `당신은 KBO 한국 프로야구 전문 AI 어시스턴트입니다.
사용자가 경기 결과를 물어보면 getGames 도구를 사용해 데이터를 가져온 후 자연스러운 한국어로 답변해주세요.
오늘은 ${today}입니다.
"오늘", "어제", "내일" 등의 상대적 날짜는 오늘 기준으로 계산하세요.
경기가 없으면 해당 날짜에 예정된 경기가 없다고 안내하세요.`,
    messages,
    tools: {
      getGames: tool({
        description:
          "KBO 프로야구 경기 정보를 날짜별로 가져옵니다. 날짜를 YYYY-MM-DD 형식으로 전달하세요.",
        inputSchema: z.object({
          date: z
            .string()
            .optional()
            .describe("YYYY-MM-DD 형식의 날짜. 없으면 오늘"),
        }),
        execute: async ({ date }) => {
          const d = createKSTDate(date);
          return await fetchGames(d);
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}

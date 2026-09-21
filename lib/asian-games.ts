/** Official schedule, including the September 11 home/away corrections. */
export const ASIAN_GAMES_SOURCE =
  "https://www.aichi-nagoya2026.org/ja/news-2050/";
export const ASIAN_GAMES_CHECKED_AT = "2026-09-21";

type Team = "KOR" | "TPE" | "HKG" | "THA" | "JPN" | "CHN" | "PHI" | "PLE";

export const NATIONAL_TEAMS: Record<Team, string> = {
  KOR: "대한민국", TPE: "대만", HKG: "홍콩", THA: "태국",
  JPN: "일본", CHN: "중국", PHI: "필리핀", PLE: "팔레스타인",
};

type Result =
  | { status: "SCHEDULED"; score: null }
  | { status: "FINISHED"; score: { home: number; away: number }; resultSource: string }
  | { status: "CANCELED" | "POSTPONED"; score: null };

export type AsianGame = {
  id: string;
  date: string;
  startTime: string;
  stadium: string;
  round: string;
  homeTeam: Team;
  awayTeam: Team;
  resultsKey: string;
} & Result;

// Curated data: update only after checking the official schedule/results.
// Do not infer a result, live status, or Korea's later-round qualification from time.
export const ASIAN_GAMES: readonly AsianGame[] = [
  {
    id: "AG2026-BBL03", date: "2026-09-21", startTime: "18:30",
    stadium: "오카자키 중앙종합공원 야구장", round: "조별리그 B조",
    awayTeam: "KOR", homeTeam: "TPE", status: "SCHEDULED", score: null,
    resultsKey: "M.TEAM9-------------.GPB-.000200--",
  },
  {
    id: "AG2026-BBL08", date: "2026-09-22", startTime: "18:30",
    stadium: "도요하시 시민구장", round: "조별리그 B조",
    awayTeam: "HKG", homeTeam: "KOR", status: "SCHEDULED", score: null,
    resultsKey: "M.TEAM9-------------.GPB-.000400--",
  },
  {
    id: "AG2026-BBL09", date: "2026-09-23", startTime: "12:00",
    stadium: "오카자키 중앙종합공원 야구장", round: "조별리그 B조",
    awayTeam: "KOR", homeTeam: "THA", status: "SCHEDULED", score: null,
    resultsKey: "M.TEAM9-------------.GPB-.000500--",
  },
];

export function getAsianGameLabel(game: AsianGame, now: number): string {
  if (game.status === "CANCELED") return "취소";
  if (game.status === "POSTPONED") return "연기";
  if (game.status === "FINISHED") {
    const koreaScore = game.homeTeam === "KOR" ? game.score.home : game.score.away;
    const opponentScore = game.homeTeam === "KOR" ? game.score.away : game.score.home;
    return koreaScore === opponentScore ? "종료 · 무승부" : koreaScore > opponentScore ? "종료 · 대한민국 승" : "종료 · 대한민국 패";
  }
  return now >= Date.parse(`${game.date}T${game.startTime}:00+09:00`)
    ? "결과 미등록"
    : "경기 예정";
}

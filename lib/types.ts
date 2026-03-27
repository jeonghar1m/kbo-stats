export interface Game {
  id: string;
  date: string;
  startTime: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  homePitcher: string;
  awayPitcher: string;
  winPitcher: string;
  losePitcher: string;
  savePitcher: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "FINISHED" | "CANCELED";
  score: { home: number; away: number };
  currentInning: number;
  broadcastServices: string[];
  season: number;
}

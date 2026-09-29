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
  inningHalf?: string;
  cancellationReason?: string;
  broadcastServices: string[];
  season: number;
}

export interface BallCount {
  balls: number;
  strikes: number;
  outs: number;
}

export interface LiveGameData {
  available: true;
  pitcher: string;
  batter: string;
  bases: { first: boolean; second: boolean; third: boolean };
  ballCount: BallCount;
  inning: number;
  inningHalf: string;
  score: { away: number; home: number };
}

export interface LiveGameUnavailable {
  available: false;
}

export type LiveGameResponse = LiveGameData | LiveGameUnavailable;

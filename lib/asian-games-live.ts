import type {
  AsianGameLiveData,
  AsianGameLiveStatus,
  LiveGameData,
} from "./types";

type Extension = {
  Type?: string;
  Code?: string;
  Value?: string;
};

type Competitor = {
  Org?: string;
  Result?: string;
  Extensions?: Extension[];
};

export type OfficialBaseballResult = {
  Info?: { Status?: string; StatusDesc?: string; IsLive?: boolean };
  Results?: {
    CurrentPeriod?: number;
    Extensions?: Extension[];
  };
  Competitors?: Competitor[];
};

const ACTIVE_STATUSES = new Set([
  "GETTING_READY",
  "RUNNING",
  "LIVE",
  "SCHEDULED_BREAK",
  "INTERMEDIATE",
]);
const FINISHED_STATUSES = new Set([
  "FINISHED",
  "UNCONFIRMED",
  "UNOFFICIAL",
  "OFFICIAL",
]);

function extensionValue(extensions: Extension[] | undefined, code: string) {
  return extensions?.find((item) => item.Code === code)?.Value?.trim() ?? "";
}

function teamServiceValue(competitor: Competitor | undefined, code: string) {
  return extensionValue(
    competitor?.Extensions?.filter((item) => item.Type === "SERVICE"),
    code,
  );
}

function parseCount(value: string, max: number) {
  const count = Number(value);
  return Number.isFinite(count) ? Math.min(Math.max(count, 0), max) : 0;
}

function parseScore(value: string | undefined) {
  if (value === undefined || value.trim() === "") return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function mapStatus(status: string): AsianGameLiveStatus {
  if (ACTIVE_STATUSES.has(status)) return "IN_PROGRESS";
  if (FINISHED_STATUSES.has(status)) return "FINISHED";
  if (status === "CANCELED") return "CANCELED";
  if (status === "POSTPONED" || status === "DELAYED") return "POSTPONED";
  return "SCHEDULED";
}

export function parseOfficialBaseballResult(
  data: OfficialBaseballResult,
  expectedHome: string,
  expectedAway: string,
): Omit<AsianGameLiveData, "available" | "updatedAt"> | null {
  const home = data.Competitors?.find((team) => team.Org === expectedHome);
  const away = data.Competitors?.find((team) => team.Org === expectedAway);
  if (!home || !away) return null;

  const rawStatus = data.Info?.Status ?? "SCHEDULED";
  const status = mapStatus(rawStatus);
  const homeScore = parseScore(home.Result);
  const awayScore = parseScore(away.Result);
  const score = homeScore === null || awayScore === null
    ? null
    : { home: homeScore, away: awayScore };

  let live: LiveGameData | null = null;
  if (status === "IN_PROGRESS" || data.Info?.IsLive) {
    const homeBatting = teamServiceValue(home, "isBatting") === "true";
    const batting = homeBatting ? home : away;
    const pitching = homeBatting ? away : home;
    const extensions = data.Results?.Extensions;
    live = {
      available: true,
      pitcher: teamServiceValue(pitching, "CurrentPitcher"),
      batter: teamServiceValue(batting, "CurrentBatter"),
      bases: {
        first: extensionValue(extensions, "Base1") === "true",
        second: extensionValue(extensions, "Base2") === "true",
        third: extensionValue(extensions, "Base3") === "true",
      },
      ballCount: {
        balls: parseCount(extensionValue(extensions, "Balls"), 3),
        strikes: parseCount(extensionValue(extensions, "Strikes"), 2),
        outs: parseCount(extensionValue(extensions, "Outs"), 2),
      },
      inning: Math.max(Number(data.Results?.CurrentPeriod ?? 1), 1),
      inningHalf: homeBatting ? "말" : "초",
      score: score ?? { home: 0, away: 0 },
    };
  }

  return {
    status,
    statusLabel: data.Info?.StatusDesc?.trim() || rawStatus,
    score,
    live,
  };
}

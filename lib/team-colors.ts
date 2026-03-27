export const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  LG: { primary: "#C30452", secondary: "#000000" },
  삼성: { primary: "#074CA1", secondary: "#FFFFFF" },
  KIA: { primary: "#EA0029", secondary: "#000000" },
  두산: { primary: "#131230", secondary: "#FFFFFF" },
  KT: { primary: "#000000", secondary: "#EB1F25" },
  SSG: { primary: "#CE0E2D", secondary: "#FFB81C" },
  NC: { primary: "#315288", secondary: "#C2A772" },
  롯데: { primary: "#041E42", secondary: "#D00F31" },
  한화: { primary: "#FF6600", secondary: "#000000" },
  키움: { primary: "#570514", secondary: "#D4A76A" },
};

export function getTeamColor(team: string) {
  return TEAM_COLORS[team] ?? { primary: "#6B7280", secondary: "#D1D5DB" };
}

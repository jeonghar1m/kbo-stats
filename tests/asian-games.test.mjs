import assert from "node:assert/strict";
import { test } from "node:test";
import { ASIAN_GAMES, getAsianGameLabel } from "../lib/asian-games.ts";

test("unconfirmed scores remain null, even after the scheduled start", () => {
  const game = ASIAN_GAMES[0];
  assert.equal(getAsianGameLabel(game, Date.parse("2026-09-21T09:29:59Z")), "경기 예정");
  assert.equal(getAsianGameLabel(game, Date.parse("2026-09-21T09:30:00Z")), "결과 미등록");
  assert.equal(getAsianGameLabel(game, Date.parse("2026-10-01T00:00:00Z")), "결과 미등록");
  assert.equal(game.score, null);
});

test("finished results use Korea's side, including zero scores and ties", () => {
  // Synthetic results only; never published as tournament data.
  const home = { ...ASIAN_GAMES[0], homeTeam: "KOR", awayTeam: "TPE", status: "FINISHED", score: { home: 0, away: 1 }, resultSource: "https://example.com/test" };
  assert.equal(getAsianGameLabel(home, 0), "종료 · 대한민국 패");
  assert.equal(getAsianGameLabel({ ...home, score: { home: 1, away: 0 } }, 0), "종료 · 대한민국 승");
  const away = { ...home, homeTeam: "HKG", awayTeam: "KOR" };
  assert.equal(getAsianGameLabel(away, 0), "종료 · 대한민국 승");
  assert.equal(getAsianGameLabel({ ...away, score: { home: 1, away: 0 } }, 0), "종료 · 대한민국 패");
  assert.equal(getAsianGameLabel({ ...away, score: { home: 0, away: 0 } }, 0), "종료 · 무승부");
});

test("canceled and postponed games are not inferred to be finished", () => {
  for (const [status, label] of [["CANCELED", "취소"], ["POSTPONED", "연기"]]) {
    assert.equal(getAsianGameLabel({ ...ASIAN_GAMES[0], status }, Infinity), label);
  }
});

test("initial schedule contains only confirmed Korea games with unique IDs", () => {
  assert.equal(new Set(ASIAN_GAMES.map((game) => game.id)).size, ASIAN_GAMES.length);
  for (const game of ASIAN_GAMES) {
    assert.ok(game.homeTeam === "KOR" || game.awayTeam === "KOR");
    assert.ok(Number.isFinite(Date.parse(`${game.date}T${game.startTime}:00+09:00`)));
  }
});

import { parseOfficialBaseballResult } from "../lib/asian-games-live.ts";

test("official live record maps score, inning, counts, bases and players", () => {
  const service = (Code, Value) => ({ Type: "SERVICE", Code, Value });
  const unit = (Code, Value) => ({ Type: "UNIT_INFO", Code, Value });
  const result = parseOfficialBaseballResult({
    Info: { Status: "RUNNING", StatusDesc: "Running", IsLive: true },
    Results: {
      CurrentPeriod: 4,
      Extensions: [unit("Balls", "2"), unit("Strikes", "1"), unit("Outs", "2"), unit("Base1", "true"), unit("Base2", "false"), unit("Base3", "true")],
    },
    Competitors: [
      { Org: "TPE", Result: "3", Extensions: [service("isBatting", "false"), service("CurrentPitcher", "Pitcher TPE")] },
      { Org: "KOR", Result: "4", Extensions: [service("isBatting", "true"), service("CurrentBatter", "Batter KOR")] },
    ],
  }, "TPE", "KOR");

  assert.deepEqual(result?.score, { home: 3, away: 4 });
  assert.equal(result?.status, "IN_PROGRESS");
  assert.equal(result?.live?.inning, 4);
  assert.equal(result?.live?.inningHalf, "초");
  assert.equal(result?.live?.pitcher, "Pitcher TPE");
  assert.equal(result?.live?.batter, "Batter KOR");
  assert.deepEqual(result?.live?.ballCount, { balls: 2, strikes: 1, outs: 2 });
  assert.deepEqual(result?.live?.bases, { first: true, second: false, third: true });
});

test("official terminal record keeps score but removes stale live state", () => {
  const result = parseOfficialBaseballResult({
    Info: { Status: "OFFICIAL", StatusDesc: "Official", IsLive: false },
    Results: { CurrentPeriod: 9, Extensions: [{ Code: "Base1", Value: "true" }] },
    Competitors: [{ Org: "KOR", Result: "7" }, { Org: "HKG", Result: "2" }],
  }, "KOR", "HKG");

  assert.equal(result?.status, "FINISHED");
  assert.deepEqual(result?.score, { home: 7, away: 2 });
  assert.equal(result?.live, null);
});

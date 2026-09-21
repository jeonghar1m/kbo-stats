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
  const home = { ...ASIAN_GAMES[0], status: "FINISHED", score: { home: 0, away: 1 }, resultSource: "https://example.com/test" };
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

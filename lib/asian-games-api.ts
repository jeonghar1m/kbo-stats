import "server-only";

import { get } from "node:https";
import { inflateSync } from "node:zlib";
import type { AsianGame } from "./asian-games";
import {
  parseOfficialBaseballResult,
  type OfficialBaseballResult,
} from "./asian-games-live";
import type { AsianGameLiveResponse } from "./types";

const RESULTS_API =
  "https://back.results.asiangames2026.org/s/AG2026/en/BBL/results";

const REQUEST_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "identity",
  Origin: "https://results.asiangames2026.org",
  Referer: "https://results.asiangames2026.org/",
  "User-Agent":
    "Mozilla/5.0 (compatible; KBOStats/1.0; +https://kbo.jeongharim.dev)",
};

export async function fetchAsianGameLive(
  game: AsianGame,
): Promise<AsianGameLiveResponse> {
  try {
    const { statusCode, bytes } = await requestOfficialResult(
      `${RESULTS_API}/${game.resultsKey}`,
    );
    if (statusCode < 200 || statusCode >= 300) {
      console.error(`[asian-games-live] upstream returned ${statusCode}`);
      return { available: false };
    }

    const body = bytes[0] === 0x78
      ? inflateSync(bytes).toString("utf8")
      : bytes.toString("utf8");
    const official = JSON.parse(body) as OfficialBaseballResult;
    const parsed = parseOfficialBaseballResult(
      official,
      game.homeTeam,
      game.awayTeam,
    );
    if (!parsed) return { available: false };

    return {
      available: true,
      ...parsed,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(
      "[asian-games-live] upstream request failed",
      error instanceof Error ? error.message : error,
    );
    return { available: false };
  }
}

function requestOfficialResult(url: string) {
  return new Promise<{ statusCode: number; bytes: Buffer }>((resolve, reject) => {
    const request = get(
      url,
      {
        headers: REQUEST_HEADERS,
        signal: AbortSignal.timeout(15_000),
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          resolve({
            statusCode: response.statusCode ?? 500,
            bytes: Buffer.concat(chunks),
          });
        });
        response.on("error", reject);
      },
    );
    request.on("error", reject);
  });
}

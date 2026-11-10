import { describe, expect, it } from "vitest";
import { buildKnockoutBracket } from "./bracket";
import type { StandingRow } from "../types";

const rows = [
  "serra",
  "treze",
  "campinense",
  "esporte",
  "nacional",
  "atletico",
].map((teamId, index) => ({
  teamId,
  position: index + 1,
  points: 10 - index,
  played: 5,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  form: [],
})) as StandingRow[];

describe("buildKnockoutBracket", () => {
  it("cruza primeiro contra quarto e segundo contra terceiro nas semifinais", () => {
    const bracket = buildKnockoutBracket(rows);
    expect(bracket.semifinals).toEqual([
      { id: "semi-1", homeTeamId: "serra", awayTeamId: "esporte" },
      { id: "semi-2", homeTeamId: "treze", awayTeamId: "campinense" },
    ]);
  });

  it("atribui o mando do segundo jogo da final ao melhor classificado possível", () => {
    expect(buildKnockoutBracket(rows).final.returnLegHomeTeamId).toBe("serra");
  });
});

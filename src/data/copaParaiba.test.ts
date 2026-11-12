import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "./copaParaiba";
import { calculateStandings } from "../lib/standings";

describe("dados da Copa Paraíba", () => {
  it("representa os seis clubes e os seis resultados oficiais das duas primeiras rodadas", () => {
    expect(copaParaiba.slug).toBe("copa-paraiba-2026");
    expect(copaParaiba.currentRound).toBe(2);
    expect(copaTeams).toHaveLength(6);
    expect(
      copaMatches.filter((match) => match.status === "finished"),
    ).toHaveLength(6);
  });

  it("reproduz a classificação oficial após a segunda rodada", () => {
    const table = calculateStandings(
      copaTeams,
      copaMatches,
      copaParaiba.tiebreakers,
    );
    expect(
      table.map((row) => [row.teamId, row.points, row.goalDifference]),
    ).toEqual([
      ["serra-branca", 4, 4],
      ["treze", 4, 1],
      ["campinense", 4, 1],
      ["esporte-patos", 1, -1],
      ["nacional-patos", 1, -1],
      ["atletico-pb", 1, -4],
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "./copaParaiba";
import { calculateStandings } from "../lib/standings";

describe("dados da Copa Paraíba", () => {
  it("representa os seis clubes e os três resultados oficiais da primeira rodada", () => {
    expect(copaParaiba.slug).toBe("copa-paraiba-2026");
    expect(copaTeams).toHaveLength(6);
    expect(
      copaMatches.filter((match) => match.status === "finished"),
    ).toHaveLength(3);
  });

  it("reproduz a classificação oficial após a primeira rodada", () => {
    const table = calculateStandings(
      copaTeams,
      copaMatches,
      copaParaiba.tiebreakers,
    );
    expect(
      table.map((row) => [row.teamId, row.points, row.goalDifference]),
    ).toEqual([
      ["serra-branca", 3, 4],
      ["treze", 3, 1],
      ["campinense", 3, 1],
      ["esporte-patos", 0, -1],
      ["nacional-patos", 0, -1],
      ["atletico-pb", 0, -4],
    ]);
  });
});

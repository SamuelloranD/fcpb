import { describe, expect, it } from "vitest";
import { calculateStandings } from "./standings";

const teams = [
  { id: "a", name: "Atlético", shortName: "ATL", color: "#1f7a4c" },
  { id: "b", name: "Boreal", shortName: "BOR", color: "#2563eb" },
  { id: "c", name: "Cerrado", shortName: "CER", color: "#dc2626" },
];

describe("calculateStandings", () => {
  it("awards three points and orders the winner above opponents", () => {
    const table = calculateStandings(teams, [
      finished("a", "b", 2, 1),
      finished("c", "a", 0, 0),
    ]);

    expect(table.map((row) => row.teamId)).toEqual(["a", "c", "b"]);
    expect(table[0]).toMatchObject({
      points: 4,
      played: 2,
      wins: 1,
      goalDifference: 1,
    });
  });

  it("uses goals scored after points and goal difference are tied", () => {
    const table = calculateStandings(teams, [
      finished("a", "b", 2, 1),
      finished("c", "b", 1, 0),
    ]);

    expect(table.slice(0, 2).map((row) => row.teamId)).toEqual(["a", "c"]);
  });
});

function finished(
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number,
) {
  return {
    id: `${homeTeamId}-${awayTeamId}`,
    championshipId: "brasileirao",
    phaseId: "liga",
    round: 1,
    homeTeamId,
    awayTeamId,
    homeScore,
    awayScore,
    status: "finished" as const,
    date: "2026-05-10T19:00:00-03:00",
    venue: "Estádio FCPB",
  };
}

import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "../data";
import { getHomeTournamentState } from "./HomePage";

describe("getHomeTournamentState", () => {
  it("builds the home snapshot from the current Copa Paraíba data", () => {
    const snapshot = getHomeTournamentState(
      copaTeams,
      copaMatches,
      copaParaiba.tiebreakers,
    );

    expect(snapshot.leader.name).toBe("Serra Branca");
    expect(snapshot.nextRound).toBe(2);
    expect(snapshot.topFour).toHaveLength(4);
    expect(snapshot.upcomingMatches).toHaveLength(3);
  });
});

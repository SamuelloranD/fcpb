import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "../data";
import * as HomePage from "./HomePage";

describe("getHomeTournamentState", () => {
  it("builds the home snapshot from the current Copa Paraíba data", () => {
    const snapshot = HomePage.getHomeTournamentState(
      copaTeams,
      copaMatches,
      copaParaiba.tiebreakers,
    );

    expect(snapshot.leader.name).toBe("Serra Branca");
    expect(snapshot.nextRound).toBe(2);
    expect(snapshot.topFour).toHaveLength(4);
    expect(snapshot.upcomingMatches).toHaveLength(3);
  });

  it("uses compact club abbreviations on narrow game cards", () => {
    const abbreviate = (HomePage as typeof HomePage & {
      compactClubName: (teamId: string, name: string) => string;
    }).compactClubName;

    expect(abbreviate("serra-branca", "Serra Branca")).toBe("SEB");
    expect(abbreviate("treze", "Treze")).toBe("TRZ");
    expect(abbreviate("campinense", "Campinense")).toBe("CAM");
    expect(abbreviate("esporte-patos", "Esporte-PB")).toBe("ESP");
    expect(abbreviate("nacional-patos", "Nacional de Patos")).toBe("NAP");
    expect(abbreviate("atletico-pb", "Atlético-PB")).toBe("ATL");
  });
});

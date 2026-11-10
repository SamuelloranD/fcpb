import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "../../data/copaParaiba";
import { calculateStandings } from "../../lib/standings";
import { formatMatchDate, Simulator } from "./Simulator";
import { useSimulationStore } from "./simulationStore";
import {
  hasAggregateDraw,
  isDraw,
  knockoutTeamName,
  finalPenaltyScoreInFirstLegOrder,
  runnerUpTeamId,
  scoreInputWidth,
} from "../bracket/KnockoutBracket";

describe("Simulator", () => {
  it("renders an independent Limpar action in the rounds and knockout cards", () => {
    const html = renderToStaticMarkup(
      <Simulator
        championship={copaParaiba}
        teams={copaTeams}
        matches={copaMatches}
        realRows={calculateStandings(
          copaTeams,
          copaMatches,
          copaParaiba.tiebreakers,
        )}
      />,
    );

    expect(html.match(/>Limpar</g) ?? []).toHaveLength(2);
    expect(html.match(/>Sortear</g) ?? []).toHaveLength(2);
    expect(html).toContain("grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]");
    expect(html).toContain('aria-label="Abrir simulador de rodadas"');
    expect(html).toContain("hidden xl:block");
    expect(html).toContain("xl:hidden");
    expect(html).not.toContain("Aumentar placar");
    expect(html).not.toContain("Diminuir placar");
  });

  it("creates knockout scores when Sortear is used", () => {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
    const store =
      useSimulationStore.getState() as typeof useSimulationStore.getState extends () => infer State
        ? State & { fillKnockout: (championshipId: string) => void }
        : never;
    store.clearKnockout(copaParaiba.id);
    store.fillKnockout(copaParaiba.id);

    expect(
      useSimulationStore.getState().knockoutScenarios[copaParaiba.id],
    ).toMatchObject({ s1: expect.any(Array), s2: expect.any(Array) });
  });

  it("identifies tied single-leg semifinals that need penalties", () => {
    expect(isDraw([1, 1])).toBe(true);
    expect(isDraw([2, 1])).toBe(false);
  });

  it("identifies tied final aggregates after the return leg", () => {
    expect(hasAggregateDraw([1, 1], [2, 2])).toBe(true);
    expect(hasAggregateDraw([1, 0], [2, 0])).toBe(false);
  });

  it("uses the return-leg penalty order to decide the correct finalist", () => {
    expect(finalPenaltyScoreInFirstLegOrder([5, 4])).toEqual([4, 5]);
  });

  it("reduces both score inputs whenever penalties are shown", () => {
    expect(scoreInputWidth(true)).toBe("w-8");
    expect(scoreInputWidth(false)).toBe("w-10");
  });

  it("uses Nacional as the Nacional de Patos name in the knockout bracket", () => {
    expect(
      knockoutTeamName(copaTeams.find((team) => team.id === "nacional-patos")!),
    ).toBe("Nacional");
  });

  it("identifies the other finalist as vice-campeão", () => {
    expect(runnerUpTeamId("treze", "treze", "serra-branca")).toBe(
      "serra-branca",
    );
  });

  it("formats match dates in a compact Brazilian format", () => {
    expect(formatMatchDate("2026-11-07T16:00:00-03:00")).toBe(
      "Sáb. · 07/11 · 16:00",
    );
  });
});

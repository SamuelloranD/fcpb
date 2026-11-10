import { beforeEach, describe, expect, it } from "vitest";
import type { StandingRow } from "../../types";
import { useSimulationStore } from "./simulationStore";

const championshipId = "copa-paraiba-2026";
const initialStandings: StandingRow[] = [{
  teamId: "serra-branca",
  position: 1,
  points: 3,
  played: 1,
  wins: 1,
  draws: 0,
  losses: 0,
  goalsFor: 2,
  goalsAgainst: 0,
  goalDifference: 2,
  form: ["V"],
}];

describe("simulationStore", () => {
  let localItems: Map<string, string>;
  let sessionItems: Map<string, string>;

  beforeEach(() => {
    localItems = new Map<string, string>();
    sessionItems = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => localItems.get(key) ?? null,
        setItem: (key: string, value: string) => localItems.set(key, value),
      },
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => sessionItems.get(key) ?? null,
        setItem: (key: string, value: string) => sessionItems.set(key, value),
      },
    });
    useSimulationStore.setState({
      scenarios: {},
      knockoutScenarios: {},
      knockoutStandings: {},
    });
  });

  it("persists simulations only for the current browser session", () => {
    useSimulationStore.getState().setScore(championshipId, "m1", [2, 1]);

    expect(sessionItems.get("fcpb-scenarios")).toContain('"m1":[2,1]');
    expect(localItems.get("fcpb-scenarios")).toBeUndefined();
  });

  it("clears knockout scores when any standing changes", () => {
    const store = useSimulationStore.getState() as typeof useSimulationStore.getState extends () => infer State
      ? State & { syncKnockoutStandings: (id: string, rows: StandingRow[]) => void }
      : never;

    expect(store.syncKnockoutStandings).toBeTypeOf("function");
    store.syncKnockoutStandings(championshipId, initialStandings);
    store.setKnockoutScore(championshipId, "s1", [2, 0]);
    store.syncKnockoutStandings(championshipId, [
      { ...initialStandings[0], points: 4, goalsFor: 3, goalDifference: 3 },
    ]);

    expect(useSimulationStore.getState().knockoutScenarios[championshipId]).toEqual({});
  });

  it("keeps the simulator available when browser storage is blocked", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error("Storage blocked");
        },
        setItem: () => {
          throw new Error("Storage blocked");
        },
      },
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error("Storage blocked");
        },
        setItem: () => {
          throw new Error("Storage blocked");
        },
      },
    });

    expect(() =>
      useSimulationStore
        .getState()
        .syncKnockoutStandings(championshipId, initialStandings),
    ).not.toThrow();
  });

  it("does not update the store when the standings signature is unchanged", () => {
    const store = useSimulationStore.getState();
    store.syncKnockoutStandings(championshipId, initialStandings);
    const standingsBeforeRepeat = useSimulationStore.getState().knockoutStandings;

    store.syncKnockoutStandings(championshipId, initialStandings);

    expect(useSimulationStore.getState().knockoutStandings).toBe(standingsBeforeRepeat);
  });
});

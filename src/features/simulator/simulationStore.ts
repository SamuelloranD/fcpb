import { create } from "zustand";
import type { ScoreOverrides, StandingRow } from "../../types";

export const standingsSignature = (rows: StandingRow[]) => JSON.stringify(rows);

interface SimulationStore {
  scenarios: Record<string, ScoreOverrides>;
  knockoutScenarios: Record<string, ScoreOverrides>;
  knockoutStandings: Record<string, string>;
  setScore: (
    championshipId: string,
    matchId: string,
    score: [number, number],
  ) => void;
  clearAll: (championshipId: string) => void;
  resetRound: (championshipId: string, matchIds: string[]) => void;
  fillMatches: (
    championshipId: string,
    matchIds: string[],
    outcome: "home" | "draw" | "away" | "random",
  ) => void;
  setKnockoutScore: (
    championshipId: string,
    matchId: string,
    score: [number, number],
  ) => void;
  clearKnockout: (championshipId: string) => void;
  fillKnockout: (championshipId: string) => void;
  syncKnockoutStandings: (championshipId: string, rows: StandingRow[]) => void;
}

const readScenarios = (): Record<string, ScoreOverrides> => {
  try {
    return JSON.parse(localStorage.getItem("fcpb-scenarios") ?? "{}");
  } catch {
    return {};
  }
};
const persist = (scenarios: Record<string, ScoreOverrides>) =>
  localStorage.setItem("fcpb-scenarios", JSON.stringify(scenarios));
const readKnockoutScenarios = (): Record<string, ScoreOverrides> => {
  try {
    return JSON.parse(localStorage.getItem("fcpb-knockout-scenarios") ?? "{}");
  } catch {
    return {};
  }
};
const persistKnockout = (scenarios: Record<string, ScoreOverrides>) =>
  localStorage.setItem("fcpb-knockout-scenarios", JSON.stringify(scenarios));
const readKnockoutStandings = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem("fcpb-knockout-standings") ?? "{}");
  } catch {
    return {};
  }
};
const persistKnockoutStandings = (standings: Record<string, string>) =>
  localStorage.setItem("fcpb-knockout-standings", JSON.stringify(standings));

export const useSimulationStore = create<SimulationStore>((set) => ({
  scenarios: typeof window === "undefined" ? {} : readScenarios(),
  knockoutScenarios:
    typeof window === "undefined" ? {} : readKnockoutScenarios(),
  knockoutStandings:
    typeof window === "undefined" ? {} : readKnockoutStandings(),
  setScore: (championshipId, matchId, score) =>
    set((state) => {
      const scenarios = {
        ...state.scenarios,
        [championshipId]: {
          ...state.scenarios[championshipId],
          [matchId]: score,
        },
      };
      persist(scenarios);
      return { scenarios };
    }),
  clearAll: (championshipId) =>
    set((state) => {
      const scenarios = { ...state.scenarios, [championshipId]: {} };
      persist(scenarios);
      return { scenarios };
    }),
  resetRound: (championshipId, matchIds) =>
    set((state) => {
      const current = { ...state.scenarios[championshipId] };
      matchIds.forEach((id) => delete current[id]);
      const scenarios = { ...state.scenarios, [championshipId]: current };
      persist(scenarios);
      return { scenarios };
    }),
  fillMatches: (championshipId, matchIds, outcome) =>
    set((state) => {
      const scores: ScoreOverrides = { ...state.scenarios[championshipId] };
      matchIds.forEach((id) => {
        const random = () => Math.floor(Math.random() * 4);
        scores[id] =
          outcome === "home"
            ? [2, 0]
            : outcome === "away"
              ? [0, 2]
              : outcome === "draw"
                ? [1, 1]
                : [random(), random()];
      });
      const scenarios = { ...state.scenarios, [championshipId]: scores };
      persist(scenarios);
      return { scenarios };
    }),
  setKnockoutScore: (championshipId, matchId, score) =>
    set((state) => {
      const knockoutScenarios = {
        ...state.knockoutScenarios,
        [championshipId]: {
          ...state.knockoutScenarios[championshipId],
          [matchId]: score,
        },
      };
      persistKnockout(knockoutScenarios);
      return { knockoutScenarios };
    }),
  clearKnockout: (championshipId) =>
    set((state) => {
      const knockoutScenarios = {
        ...state.knockoutScenarios,
        [championshipId]: {},
      };
      persistKnockout(knockoutScenarios);
      return { knockoutScenarios };
    }),
  fillKnockout: (championshipId) =>
    set((state) => {
      const score = (): [number, number] => {
        const home = Math.floor(Math.random() * 4);
        const away = Math.floor(Math.random() * 4);
        return home === away ? [home + 1, away] : [home, away];
      };
      const current = state.knockoutScenarios[championshipId] ?? {};
      const next = { ...current };
      for (const matchId of ["s1", "s2", "f1", "f2"])
        if (!next[matchId]) next[matchId] = score();
      const knockoutScenarios = {
        ...state.knockoutScenarios,
        [championshipId]: next,
      };
      persistKnockout(knockoutScenarios);
      return { knockoutScenarios };
    }),
  syncKnockoutStandings: (championshipId, rows) =>
    set((state) => {
      const signature = standingsSignature(rows);
      const previousSignature = state.knockoutStandings[championshipId];
      const currentScores = state.knockoutScenarios[championshipId] ?? {};
      const scoresAreStale =
        Object.keys(currentScores).length > 0 && previousSignature !== signature;
      const knockoutScenarios = scoresAreStale
        ? { ...state.knockoutScenarios, [championshipId]: {} }
        : state.knockoutScenarios;
      const knockoutStandings = {
        ...state.knockoutStandings,
        [championshipId]: signature,
      };

      if (scoresAreStale) persistKnockout(knockoutScenarios);
      persistKnockoutStandings(knockoutStandings);
      return { knockoutScenarios, knockoutStandings };
    }),
}));

export type MatchStatus = "finished" | "scheduled";
export type FormResult = "V" | "E" | "D";
export type Tiebreaker =
  | "points"
  | "wins"
  | "goalDifference"
  | "goalsFor"
  | "headToHead";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  badgeUrl?: string;
}

export interface Match {
  id: string;
  championshipId: string;
  phaseId: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  date: string;
  venue: string;
}

export interface Championship {
  id: string;
  slug: string;
  name: string;
  season: string;
  currentRound: number;
  format: string;
  phaseId: string;
  tiebreakers: Tiebreaker[];
}

export interface StandingRow {
  teamId: string;
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: FormResult[];
}

export type ScoreOverrides = Record<string, [number, number]>;
export interface SimulationState {
  championshipId: string;
  overrides: ScoreOverrides;
}

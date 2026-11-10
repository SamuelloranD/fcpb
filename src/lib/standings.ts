import type {
  FormResult,
  Match,
  ScoreOverrides,
  StandingRow,
  Team,
  Tiebreaker,
} from "../types";

const defaultTiebreakers: Tiebreaker[] = [
  "points",
  "wins",
  "goalDifference",
  "goalsFor",
  "headToHead",
];

export function applyScoreOverrides(
  matches: Match[],
  overrides: ScoreOverrides,
): Match[] {
  return matches.map((match) => {
    const score = overrides[match.id];
    if (match.status === "finished" || !score) return match;
    return {
      ...match,
      homeScore: score[0],
      awayScore: score[1],
      status: "finished" as const,
    };
  });
}

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  criteria = defaultTiebreakers,
): StandingRow[] {
  const rows = new Map(teams.map((team) => [team.id, emptyRow(team.id)]));
  const forms = new Map(teams.map((team) => [team.id, [] as FormResult[]]));

  for (const match of matches) {
    if (
      match.status !== "finished" ||
      match.homeScore === null ||
      match.awayScore === null
    )
      continue;
    const home = rows.get(match.homeTeamId);
    const away = rows.get(match.awayTeamId);
    if (!home || !away) continue;
    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;
    const result =
      match.homeScore === match.awayScore
        ? 0
        : match.homeScore > match.awayScore
          ? 1
          : -1;
    if (result === 0) {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
      forms.get(home.teamId)?.push("E");
      forms.get(away.teamId)?.push("E");
    }
    if (result === 1) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
      forms.get(home.teamId)?.push("V");
      forms.get(away.teamId)?.push("D");
    }
    if (result === -1) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
      forms.get(home.teamId)?.push("D");
      forms.get(away.teamId)?.push("V");
    }
  }

  const table = [...rows.values()].map((row) => ({
    ...row,
    goalDifference: row.goalsFor - row.goalsAgainst,
    form: (forms.get(row.teamId) ?? []).slice(-5),
  }));
  table.sort((left, right) => compareRows(left, right, criteria, matches));
  return table.map((row, index) => ({ ...row, position: index + 1 }));
}

function emptyRow(teamId: string): StandingRow {
  return {
    teamId,
    position: 0,
    points: 0,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    form: [],
  };
}

function compareRows(
  left: StandingRow,
  right: StandingRow,
  criteria: Tiebreaker[],
  matches: Match[],
) {
  for (const criterion of criteria) {
    const difference =
      criterion === "headToHead"
        ? headToHeadPoints(left.teamId, right.teamId, matches)
        : left[criterion] - right[criterion];
    if (difference !== 0) return -difference;
  }
  return left.teamId.localeCompare(right.teamId);
}

function headToHeadPoints(firstId: string, secondId: string, matches: Match[]) {
  let first = 0;
  let second = 0;
  for (const match of matches) {
    if (
      match.status !== "finished" ||
      match.homeScore === null ||
      match.awayScore === null
    )
      continue;
    if (
      !(
        (match.homeTeamId === firstId && match.awayTeamId === secondId) ||
        (match.homeTeamId === secondId && match.awayTeamId === firstId)
      )
    )
      continue;
    const firstScore =
      match.homeTeamId === firstId ? match.homeScore : match.awayScore;
    const secondScore =
      match.homeTeamId === secondId ? match.homeScore : match.awayScore;
    if (firstScore > secondScore) first += 3;
    else if (secondScore > firstScore) second += 3;
    else {
      first += 1;
      second += 1;
    }
  }
  return first - second;
}

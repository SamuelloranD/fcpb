import type { StandingRow } from "../types";

export interface KnockoutMatch {
  id: "semi-1" | "semi-2";
  homeTeamId: string;
  awayTeamId: string;
}
export interface KnockoutBracket {
  semifinals: KnockoutMatch[];
  final: { returnLegHomeTeamId: string };
}

export function buildKnockoutBracket(rows: StandingRow[]): KnockoutBracket {
  if (rows.length < 4)
    throw new Error(
      "São necessários quatro classificados para formar as semifinais.",
    );
  return {
    semifinals: [
      { id: "semi-1", homeTeamId: rows[0].teamId, awayTeamId: rows[3].teamId },
      { id: "semi-2", homeTeamId: rows[1].teamId, awayTeamId: rows[2].teamId },
    ],
    final: { returnLegHomeTeamId: rows[0].teamId },
  };
}

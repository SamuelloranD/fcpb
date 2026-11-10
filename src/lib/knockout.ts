export type Score = [number, number];

export function resolveSingleMatch(
  homeTeamId: string,
  awayTeamId: string,
  score?: Score,
  penalties?: Score,
): string | null {
  if (!score) return null;
  if (score[0] > score[1]) return homeTeamId;
  if (score[1] > score[0]) return awayTeamId;
  return resolvePenalties(homeTeamId, awayTeamId, penalties);
}

export function resolveTwoLegFinal(
  firstLegHomeTeamId: string,
  secondLegHomeTeamId: string,
  firstLegScore?: Score,
  secondLegScore?: Score,
  penalties?: Score,
): string | null {
  if (!firstLegScore || !secondLegScore) return null;
  const firstLegAggregate = firstLegScore[0] + secondLegScore[1];
  const secondLegAggregate = firstLegScore[1] + secondLegScore[0];
  if (firstLegAggregate > secondLegAggregate) return firstLegHomeTeamId;
  if (secondLegAggregate > firstLegAggregate) return secondLegHomeTeamId;
  return resolvePenalties(firstLegHomeTeamId, secondLegHomeTeamId, penalties);
}

export function selectFinalReturnHome(
  firstFinalistId: string,
  secondFinalistId: string,
  positions: Record<string, number>,
): string {
  return positions[firstFinalistId] <= positions[secondFinalistId]
    ? firstFinalistId
    : secondFinalistId;
}

function resolvePenalties(
  firstTeamId: string,
  secondTeamId: string,
  penalties?: Score,
): string | null {
  if (!penalties || penalties[0] === penalties[1]) return null;
  return penalties[0] > penalties[1] ? firstTeamId : secondTeamId;
}

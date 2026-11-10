import { copaMatches, copaParaiba, copaTeams } from "../data";
import { calculateStandings } from "../lib/standings";
import type { Championship, Match, StandingRow, Team } from "../types";

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error("Não foi possível carregar os dados.");
  return response.json() as Promise<T>;
}

export async function getChampionships(): Promise<Championship[]> {
  return baseUrl ? request("/api/championships") : [copaParaiba];
}

export async function getChampionship(slug: string): Promise<Championship> {
  if (baseUrl) return request(`/api/championships/${slug}`);
  if (slug === copaParaiba.slug) return copaParaiba;
  throw new Error("Campeonato não encontrado.");
}

export async function getMatches(championshipId: string): Promise<Match[]> {
  return baseUrl
    ? request(`/api/championships/${championshipId}/matches`)
    : copaMatches.filter((match) => match.championshipId === championshipId);
}

export async function getRounds(championshipId: string): Promise<number[]> {
  const championshipMatches = await getMatches(championshipId);
  return [...new Set(championshipMatches.map((match) => match.round))].sort(
    (a, b) => a - b,
  );
}

export async function getStandings(
  championshipId: string,
  _phaseId?: string,
): Promise<StandingRow[]> {
  if (baseUrl) return request(`/api/championships/${championshipId}/standings`);
  return calculateStandings(
    copaTeams,
    await getMatches(championshipId),
    copaParaiba.tiebreakers,
  );
}

export async function getTeam(id: string): Promise<Team> {
  if (baseUrl) return request(`/api/teams/${id}`);
  const team = copaTeams.find((item) => item.id === id);
  if (!team) throw new Error("Time não encontrado.");
  return team;
}

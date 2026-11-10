import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TeamBadge } from "../components/TeamBadge";
import { copaParaiba, copaTeams } from "../data";
import { calculateStandings } from "../lib/standings";
import { getMatches } from "../services/api";
import type { Match, Team, Tiebreaker } from "../types";

const compactClubNames: Record<string, string> = {
  "serra-branca": "SEB",
  treze: "TRZ",
  campinense: "CAM",
  "esporte-patos": "ESP",
  "nacional-patos": "NAP",
  "atletico-pb": "ATL",
};

export const compactClubName = (teamId: string, name: string) =>
  compactClubNames[teamId] ?? name;

export function getHomeTournamentState(
  teams: Team[],
  matches: Match[],
  tiebreakers: Tiebreaker[],
) {
  const standings = calculateStandings(teams, matches, tiebreakers);
  const upcomingMatches = matches
    .filter((match) => match.status === "scheduled")
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(0, 3);

  return {
    leader: teams.find((team) => team.id === standings[0].teamId)!,
    nextRound: upcomingMatches[0]?.round ?? matches.at(-1)?.round ?? 1,
    topFour: standings.slice(0, 4),
    upcomingMatches,
  };
}

function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Sao_Paulo",
  })
    .format(new Date(date))
    .replace(".", "");
}

function formatMatchTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(date));
}

export function HomePage() {
  const games = useQuery({
    queryKey: ["matches", copaParaiba.id],
    queryFn: () => getMatches(copaParaiba.id),
  });

  if (games.isLoading) {
    return <div className="panel animate-pulse p-10">Carregando Copa Paraíba…</div>;
  }

  if (games.isError || !games.data) {
    return <div className="panel p-10 text-rose-600">Não foi possível carregar os dados.</div>;
  }

  const state = getHomeTournamentState(copaTeams, games.data, copaParaiba.tiebreakers);
  const team = (id: string) => copaTeams.find((item) => item.id === id)!;

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-[#063F30] p-6 text-white shadow-sm sm:p-9">
        <div className="absolute -right-12 -top-16 hidden h-80 w-80 rounded-full border-[28px] border-emerald-400/15 md:block" />
        <div className="absolute bottom-0 right-12 hidden h-28 w-64 border-x-2 border-t-2 border-emerald-200/40 md:block" />
        <div className="absolute bottom-8 right-28 hidden text-emerald-200/90 md:block">
          <Trophy size={106} strokeWidth={1.25} />
        </div>
        <div className="relative z-10">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-200">
          <Trophy size={16} /> Copa Paraíba 2026 · 1ª rodada concluída
        </p>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Seu campeonato. Suas previsões.
            </h1>
            <p className="mt-3 max-w-xl text-emerald-100">
              Acompanhe os resultados e simule o caminho até a final.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A7F3D0] px-4 py-3 font-bold text-[#063F30] shadow-sm transition hover:bg-white"
              to="/campeonatos/copa-paraiba-2026?tab=simulator"
            >
              Simular campeonato
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white/95 px-4 py-3 font-bold text-[#063F30] shadow-sm transition hover:bg-white"
              to="/campeonatos/copa-paraiba-2026"
            >
              Ver classificação
            </Link>
          </div>
        </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard icon={<Trophy size={19} />} label="Líder atual" value={state.leader.name} detail={state.topFour[0].points + " pontos"} />
        <SummaryCard icon={<CalendarDays size={19} />} label="Próxima rodada" value={state.nextRound + "ª rodada"} detail={state.upcomingMatches.length + " jogos programados"} />
        <SummaryCard icon={<ShieldCheck size={19} />} label="Vagas na semifinal" value="4 clubes" detail="Os quatro primeiros avançam" />
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <section className="panel p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">2ª rodada</p>
              <h2 className="text-xl font-black">Próximos jogos</h2>
            </div>
            <CalendarDays className="text-emerald-700" size={20} />
          </div>
          <div className="grid gap-3">
            {state.upcomingMatches.map((match) => (
              <article key={match.id} className="panel p-4">
                <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--muted)]">
                  <span>{formatMatchDate(match.date)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {match.venue}</span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-center gap-2">
                  <ClubLabel team={team(match.homeTeamId)} side="right" />
                  <span className="grid justify-items-center gap-0.5 text-center">
                    <b className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">
                      {match.status === "finished"
                        ? match.homeScore + " × " + match.awayScore
                        : formatMatchTime(match.date)}
                    </b>
                    <small className="text-[10px] font-black text-[var(--muted)]">VS</small>
                  </span>
                  <ClubLabel team={team(match.awayTeamId)} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Classificação atual</p>
              <h2 className="text-xl font-black">Top 4</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 border-b px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
            <span className="w-5" aria-hidden="true" />
            <span className="flex-1">Clube</span>
            <span className="w-8 text-right">Pts</span>
            <span className="w-6 text-center">J</span>
            <span className="w-6 text-center">V</span>
            <span className="w-7 text-center">SG</span>
          </div>
          <div className="flex flex-1 flex-col divide-y">
            {state.topFour.map((row) => {
              const current = team(row.teamId);
              return (
                <div key={row.teamId} className="flex flex-1 items-center gap-2 px-3 py-3">
                  <span className="w-5 text-center font-black text-emerald-700">{row.position}</span>
                  <TeamBadge team={current} size="xs" />
                  <span className="min-w-0 flex-1 truncate font-bold">{current.name}</span>
                  <span className="w-8 text-right text-sm font-black">{row.points}</span>
                  <span className="w-6 text-center text-sm font-semibold">{row.played}</span>
                  <span className="w-6 text-center text-sm font-semibold">{row.wins}</span>
                  <span className="w-7 text-center text-sm font-semibold">{row.goalDifference > 0 ? "+" : ""}{row.goalDifference}</span>
                </div>
              );
            })}
          </div>
          <Link
            to="/campeonatos/copa-paraiba-2026"
            className="flex items-center justify-center gap-2 border-t p-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            Ver tabela completa <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="panel flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[var(--muted)]">{label}</p>
        <p className="truncate font-black">{value}</p>
        <p className="truncate text-xs text-[var(--muted)]">{detail}</p>
      </div>
    </article>
  );
}

function ClubLabel({ team, side = "left" }: { team: Team; side?: "left" | "right" }) {
  const className = ["flex min-w-0 items-center gap-2", side === "right" ? "justify-end text-right" : ""].filter(Boolean).join(" ");
  return (
    <div className={className}>
      {side === "right" && <ClubName team={team} />}
      <TeamBadge team={team} size="xs" />
      {side === "left" && <ClubName team={team} />}
    </div>
  );
}

function ClubName({ team }: { team: Team }) {
  return (
    <>
      <span className="hidden truncate font-bold min-[431px]:inline">{team.name}</span>
      <span className="truncate font-bold min-[431px]:hidden">
        {compactClubName(team.id, team.name)}
      </span>
    </>
  );
}

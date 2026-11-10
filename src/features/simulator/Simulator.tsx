import { useMemo } from "react";
import { Dices, Eraser } from "lucide-react";
import { calculateStandings, applyScoreOverrides } from "../../lib/standings";
import { useSimulationStore } from "./simulationStore";
import { StandingsTable } from "../standings/StandingsTable";
import { KnockoutBracket } from "../bracket/KnockoutBracket";
import { TeamBadge } from "../../components/TeamBadge";
import { ScoreInput } from "../../components/ScoreInput";
import type { Championship, Match, Team } from "../../types";

export function formatMatchDate(date: string) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).formatToParts(new Date(date));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const weekday = value("weekday").replace(".", "");
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}. · ${value("day")}/${value("month")} · ${value("hour")}:${value("minute")}`;
}

export function Simulator({
  championship,
  teams,
  matches,
  realRows,
}: {
  championship: Championship;
  teams: Team[];
  matches: Match[];
  realRows: ReturnType<typeof calculateStandings>;
}) {
  const store = useSimulationStore();
  const overrides = store.scenarios[championship.id] ?? {};
  const rounds = [...new Set(matches.map((match) => match.round))];
  const simulated = useMemo(
    () =>
      calculateStandings(
        teams,
        applyScoreOverrides(matches, overrides),
        championship.tiebreakers,
      ),
    [teams, matches, overrides, championship.tiebreakers],
  );
  const positions = Object.fromEntries(
    realRows.map((row) => [row.teamId, row.position]),
  );
  const team = (id: string) => teams.find((item) => item.id === id)!;
  const scheduledMatchIds = matches
    .filter((match) => match.status !== "finished")
    .map((match) => match.id);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <section className="panel p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Modo simulador
            </p>
            <h2 className="text-xl font-black">Rodadas</h2>
          </div>
          <div className="flex gap-2">
            <button
              className="action"
              onClick={() =>
                store.fillMatches(championship.id, scheduledMatchIds, "random")
              }
            >
              <Dices size={16} />
              Sortear
            </button>
            <button
              className="action"
              onClick={() => store.clearAll(championship.id)}
            >
              <Eraser size={16} />
              Limpar
            </button>
          </div>
        </div>
        {rounds.map((round) => (
          <div key={round} className="mb-5 last:mb-0">
            <h3 className="mb-2 font-black">{round}ª rodada</h3>
            <div className="space-y-3">
              {matches
                .filter((match) => match.round === round)
                .map((match) => (
                  <ScoreRow
                    key={match.id}
                    match={match}
                    score={overrides[match.id]}
                    onChange={(score) =>
                      store.setScore(championship.id, match.id, score)
                    }
                    home={team(match.homeTeamId)}
                    away={team(match.awayTeamId)}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>
      <div className="space-y-5">
        <section className="panel overflow-hidden">
          <div className="border-b p-4">
            <h2 className="text-xl font-black">Classificação simulada</h2>
          </div>
          <StandingsTable
            rows={simulated}
            teams={teams}
            previousPositions={positions}
          />
        </section>
        <KnockoutBracket
          rows={simulated}
          teams={teams}
          championshipId={championship.id}
        />
      </div>
    </div>
  );
}

function ScoreRow({
  match,
  home,
  away,
  score,
  onChange,
}: {
  match: Match;
  home: Team;
  away: Team;
  score?: [number, number];
  onChange: (score: [number, number]) => void;
}) {
  const locked = match.status === "finished";
  const update = (index: 0 | 1, value: string) => {
    const next: [number, number] = score
      ? ([...score] as [number, number])
      : [0, 0];
    next[index] = Math.max(0, Number(value) || 0);
    onChange(next);
  };
  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border p-1">
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right text-sm font-bold">
          <span className="whitespace-nowrap text-[13px]">{home.name}</span>
          <TeamBadge team={home} size="sm" />
        </div>
        <ScoreInput
          disabled={locked}
          value={locked ? (match.homeScore ?? "") : (score?.[0] ?? "")}
          onChange={(value) => update(0, value)}
          ariaLabel={`Placar do ${home.name}`}
        />
        <span>×</span>
        <ScoreInput
          disabled={locked}
          value={locked ? (match.awayScore ?? "") : (score?.[1] ?? "")}
          onChange={(value) => update(1, value)}
          ariaLabel={`Placar do ${away.name}`}
        />
        <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold">
          <TeamBadge team={away} size="sm" />
          <span className="whitespace-nowrap text-[13px]">{away.name}</span>
        </div>
      </div>
      <p className="mt-0.5 text-center text-[9px] leading-none font-medium text-[var(--muted)]">
        {formatMatchDate(match.date)}
      </p>
    </div>
  );
}

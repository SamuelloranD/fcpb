import { Dices, Eraser, X } from "lucide-react";
import { ScoreInput } from "../../components/ScoreInput";
import { TeamBadge } from "../../components/TeamBadge";
import type { Championship, Match, Team } from "../../types";
import { useSimulationStore } from "./simulationStore";

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

type RoundsPanelProps = {
  championship: Championship;
  teams: Team[];
  matches: Match[];
  compact?: boolean;
  onClose?: () => void;
};

export function RoundsPanel({
  championship,
  teams,
  matches,
  compact = false,
  onClose,
}: RoundsPanelProps) {
  const store = useSimulationStore();
  const overrides = store.scenarios[championship.id] ?? {};
  const rounds = [...new Set(matches.map((match) => match.round))];
  const scheduledMatchIds = matches
    .filter((match) => match.status !== "finished")
    .map((match) => match.id);
  const team = (id: string) => teams.find((item) => item.id === id)!;

  return (
    <section className={compact ? "min-h-full bg-[var(--bg)] p-4" : "panel p-4 sm:p-5"}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Modo simulador
          </p>
          <h2 className="text-xl font-black">Rodadas</h2>
        </div>
        <div className="flex items-center gap-2">
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
          {onClose && (
            <button
              type="button"
              aria-label="Fechar simulador"
              className="grid h-10 w-10 place-items-center rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {rounds.map((round) => (
        <div key={round} className="mb-5 last:mb-0">
          <h3 className="mb-2 font-black">{round}ª rodada</h3>
          <div className={compact ? "space-y-2" : "space-y-3"}>
            {matches
              .filter((match) => match.round === round)
              .map((match) => (
                <RoundMatch
                  key={match.id}
                  match={match}
                  home={team(match.homeTeamId)}
                  away={team(match.awayTeamId)}
                  score={overrides[match.id]}
                  compact={compact}
                  onChange={(score) =>
                    store.setScore(championship.id, match.id, score)
                  }
                />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function RoundMatch({
  match,
  home,
  away,
  score,
  compact,
  onChange,
}: {
  match: Match;
  home: Team;
  away: Team;
  score?: [number, number];
  compact: boolean;
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
  const homeValue = locked ? (match.homeScore ?? "") : (score?.[0] ?? "");
  const awayValue = locked ? (match.awayScore ?? "") : (score?.[1] ?? "");

  if (compact) {
    return (
      <div>
        <div className="mx-auto grid w-full max-w-[17rem] grid-cols-[auto_2.5rem_auto_2.5rem_auto] items-center justify-center gap-2 rounded-xl border p-2.5">
          <TeamBadge team={home} size="xs" />
          <ScoreInput
            className="w-10"
            disabled={locked}
            showStepper={false}
            selectOnFocus
            value={homeValue}
            onChange={(value) => update(0, value)}
            ariaLabel={`Placar do ${home.name}`}
          />
          <span className="text-sm">×</span>
          <ScoreInput
            className="w-10"
            disabled={locked}
            showStepper={false}
            selectOnFocus
            value={awayValue}
            onChange={(value) => update(1, value)}
            ariaLabel={`Placar do ${away.name}`}
          />
          <TeamBadge team={away} size="xs" />
        </div>
        <p className="mt-1 text-center text-[9px] leading-none font-medium text-[var(--muted)]">
          {formatMatchDate(match.date)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border p-1">
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right text-sm font-bold">
          <span className="whitespace-nowrap text-[13px]">{home.name}</span>
          <TeamBadge team={home} size="sm" />
        </div>
        <ScoreInput
          disabled={locked}
          showStepper={false}
          value={homeValue}
          onChange={(value) => update(0, value)}
          ariaLabel={`Placar do ${home.name}`}
        />
        <span>×</span>
        <ScoreInput
          disabled={locked}
          showStepper={false}
          value={awayValue}
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

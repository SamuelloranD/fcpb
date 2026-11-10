import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { TeamBadge } from "../../components/TeamBadge";
import type { Match, Team } from "../../types";
export function RoundBrowser({
  matches,
  teams,
  round,
  setRound,
}: {
  matches: Match[];
  teams: Team[];
  round: number;
  setRound: (round: number) => void;
}) {
  const current = matches.filter((match) => match.round === round);
  const max = Math.max(...matches.map((match) => match.round));
  const team = (id: string) => teams.find((item) => item.id === id)!;
  return (
    <section className="panel p-3 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <button
          className="action-secondary !p-2"
          disabled={round === 1}
          onClick={() => setRound(round - 1)}
          aria-label="Rodada anterior"
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold uppercase text-[var(--muted)]">
            Brasileirão 2026
          </p>
          <h2 className="font-black">{round}ª rodada</h2>
        </div>
        <button
          className="action-secondary !p-2"
          disabled={round === max}
          onClick={() => setRound(round + 1)}
          aria-label="Próxima rodada"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="grid gap-2">
        {current.map((match) => {
          const home = team(match.homeTeamId),
            away = team(match.awayTeamId),
            finished = match.status === "finished";
          return (
            <article
              key={match.id}
              className="flex items-center justify-between rounded-xl border p-3 sm:p-4"
            >
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right font-bold">
                <span>{home.name}</span>
                <TeamBadge team={home} size="sm" />
              </div>
              <div className="mx-3 min-w-20 text-center">
                <strong className="text-base">
                  {finished ? `${match.homeScore} — ${match.awayScore}` : "—"}
                </strong>
                <small className="mt-1 block text-[10px] text-[var(--muted)]">
                  {finished
                    ? "Encerrado"
                    : new Date(match.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </small>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 font-bold">
                <TeamBadge team={away} size="sm" />
                <span>{away.name}</span>
              </div>
              <span className="hidden items-center gap-1 text-xs text-[var(--muted)] lg:flex">
                <MapPin size={13} />
                {match.venue}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

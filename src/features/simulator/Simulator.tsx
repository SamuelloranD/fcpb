import { useMemo, useState } from "react";
import { PanelRightOpen } from "lucide-react";
import { calculateStandings, applyScoreOverrides } from "../../lib/standings";
import { KnockoutBracket } from "../bracket/KnockoutBracket";
import { StandingsTable } from "../standings/StandingsTable";
import type { Championship, Match, Team } from "../../types";
import { RoundsPanel, formatMatchDate } from "./RoundsPanel";
import { useSimulationStore } from "./simulationStore";

export { formatMatchDate };

const emptyScoreOverrides = {};

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
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const store = useSimulationStore();
  const overrides = store.scenarios[championship.id] ?? emptyScoreOverrides;
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

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <div className="hidden xl:block">
          <RoundsPanel
            championship={championship}
            teams={teams}
            matches={matches}
          />
        </div>

        <div className="space-y-5">
          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b p-4">
              <h2 className="text-xl font-black">Classificação simulada</h2>
              <button
                type="button"
                aria-label="Abrir simulador de rodadas"
                className="action xl:hidden"
                onClick={() => setIsMobilePanelOpen(true)}
              >
                <PanelRightOpen size={16} />
                Simular
              </button>
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

      {isMobilePanelOpen && (
        <div className="fixed inset-x-0 top-0 z-50 h-screen h-[100lvh] overflow-hidden overscroll-contain xl:hidden">
          <button
            type="button"
            aria-label="Fechar painel do simulador"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"
            onClick={() => setIsMobilePanelOpen(false)}
          />
          <aside
            aria-label="Painel do simulador de rodadas"
            className="absolute right-0 top-0 h-screen h-[100lvh] w-[clamp(17rem,76vw,19rem)] overflow-y-auto overscroll-contain border-l bg-[var(--bg)] shadow-2xl"
          >
            <RoundsPanel
              championship={championship}
              teams={teams}
              matches={matches}
              compact
              onClose={() => setIsMobilePanelOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

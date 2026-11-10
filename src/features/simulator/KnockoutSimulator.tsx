import { buildKnockoutBracket } from "../../lib/bracket";
import {
  resolveSingleMatch,
  resolveTwoLegFinal,
  selectFinalReturnHome,
} from "../../lib/knockout";
import type { StandingRow, Team } from "../../types";
import { useSimulationStore } from "./simulationStore";

export function KnockoutSimulator({
  championshipId,
  rows,
  teams,
}: {
  championshipId: string;
  rows: StandingRow[];
  teams: Team[];
}) {
  const store = useSimulationStore();
  const scores = store.knockoutScenarios[championshipId] ?? {};
  const bracket = buildKnockoutBracket(rows);
  const team = (id: string) => teams.find((item) => item.id === id)!;
  const pos = Object.fromEntries(rows.map((r) => [r.teamId, r.position]));
  const a = bracket.semifinals[0],
    b = bracket.semifinals[1];
  const aw = resolveSingleMatch(
    a.homeTeamId,
    a.awayTeamId,
    scores["semi-1"],
    scores["semi-1-pens"],
  );
  const bw = resolveSingleMatch(
    b.homeTeamId,
    b.awayTeamId,
    scores["semi-2"],
    scores["semi-2-pens"],
  );
  const home = aw && bw ? selectFinalReturnHome(aw, bw, pos) : null;
  const away = home && aw && bw ? (home === aw ? bw : aw) : null;
  const champion =
    home && away
      ? resolveTwoLegFinal(
          away,
          home,
          scores["final-ida"],
          scores["final-volta"],
          scores["final-pens"],
        )
      : null;
  const Match = ({
    id,
    label,
    h,
    v,
  }: {
    id: string;
    label: string;
    h: string;
    v: string;
  }) => (
    <div className="mb-3 rounded-xl border p-3">
      <b className="mb-2 block text-xs text-emerald-700">{label}</b>
      <Line id={id} index={0} idTeam={h} />
      <Line id={id} index={1} idTeam={v} />
      {scores[id]?.[0] === scores[id]?.[1] && (
        <div className="mt-2 border-t pt-2 text-xs">
          Pênaltis <Fields id={`${id}-pens`} />
        </div>
      )}
    </div>
  );
  const Line = ({
    id,
    index,
    idTeam,
  }: {
    id: string;
    index: 0 | 1;
    idTeam: string;
  }) => (
    <div className="flex items-center justify-between py-1">
      <span className="font-bold">{team(idTeam).name}</span>
      <input
        className="h-8 w-10 rounded border text-center font-black"
        type="number"
        value={scores[id]?.[index] ?? ""}
        onChange={(e) => {
          const next = scores[id]
            ? ([...scores[id]] as [number, number])
            : ([0, 0] as [number, number]);
          next[index] = Math.max(0, Number(e.target.value) || 0);
          store.setKnockoutScore(championshipId, id, next);
        }}
      />
    </div>
  );
  const Fields = ({ id }: { id: string }) => (
    <span className="ml-2">
      <input
        className="w-9 border text-center"
        type="number"
        onChange={(e) =>
          store.setKnockoutScore(championshipId, id, [
            Number(e.target.value) || 0,
            scores[id]?.[1] ?? 0,
          ])
        }
      />
      <input
        className="ml-1 w-9 border text-center"
        type="number"
        onChange={(e) =>
          store.setKnockoutScore(championshipId, id, [
            scores[id]?.[0] ?? 0,
            Number(e.target.value) || 0,
          ])
        }
      />
    </span>
  );
  return (
    <div className="pt-4">
      <h3 className="mb-2 font-black">Simular chaveamento</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Match
            id="semi-1"
            label="1º × 4º"
            h={a.homeTeamId}
            v={a.awayTeamId}
          />
          <Match
            id="semi-2"
            label="2º × 3º"
            h={b.homeTeamId}
            v={b.awayTeamId}
          />
        </div>
        <div>
          {home && away ? (
            <>
              <Match id="final-ida" label="Final · ida" h={away} v={home} />
              <Match id="final-volta" label="Final · volta" h={home} v={away} />
              {champion && (
                <b className="text-amber-700">{team(champion).name} campeão!</b>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Defina os vencedores das semifinais.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { Dices, Eraser, Medal, Trophy } from "lucide-react";
import placeholder from "../../assets/teams/placeholder.png";
import { TeamBadge } from "../../components/TeamBadge";
import { ScoreInput } from "../../components/ScoreInput";
import { buildKnockoutBracket } from "../../lib/bracket";
import {
  resolveSingleMatch,
  resolveTwoLegFinal,
  selectFinalReturnHome,
} from "../../lib/knockout";
import type { Score } from "../../lib/knockout";
import type { StandingRow, Team } from "../../types";
import { standingsSignature, useSimulationStore } from "../simulator/simulationStore";

export const isDraw = (score?: Score) =>
  Boolean(score) && score![0] === score![1];
export const hasAggregateDraw = (firstLeg?: Score, returnLeg?: Score) =>
  Boolean(firstLeg && returnLeg) &&
  firstLeg![0] + returnLeg![1] === firstLeg![1] + returnLeg![0];
export const scoreInputWidth = (showPenalties?: boolean) =>
  showPenalties ? "w-8" : "w-10";
export const knockoutTeamName = (team: Team) =>
  team.id === "nacional-patos" ? "Nacional" : team.name;
export const runnerUpTeamId = (
  champion?: string | null,
  firstFinalist?: string | null,
  secondFinalist?: string | null,
) =>
  champion && firstFinalist && secondFinalist
    ? champion === firstFinalist
      ? secondFinalist
      : firstFinalist
    : null;

export function KnockoutBracket({
  rows,
  teams,
  championshipId = "copa-paraiba-2026",
}: {
  rows: StandingRow[];
  teams: Team[];
  championshipId?: string;
}) {
  const store = useSimulationStore();
  const syncKnockoutStandings = useSimulationStore(
    (state) => state.syncKnockoutStandings,
  );
  const signature = standingsSignature(rows);
  const scores = store.knockoutStandings[championshipId] === signature
    ? (store.knockoutScenarios[championshipId] ?? {})
    : {};
  useEffect(() => {
    syncKnockoutStandings(championshipId, rows);
  }, [championshipId, rows, syncKnockoutStandings]);
  const [firstSemi, secondSemi] = buildKnockoutBracket(rows).semifinals;
  const getTeam = (id: string) => teams.find((team) => team.id === id)!;
  const positions = Object.fromEntries(
    rows.map((row) => [row.teamId, row.position]),
  );
  const firstWinner = resolveSingleMatch(
    firstSemi.homeTeamId,
    firstSemi.awayTeamId,
    scores.s1,
    scores["s1-p"],
  );
  const secondWinner = resolveSingleMatch(
    secondSemi.homeTeamId,
    secondSemi.awayTeamId,
    scores.s2,
    scores["s2-p"],
  );
  const returnLegHome =
    firstWinner && secondWinner
      ? selectFinalReturnHome(firstWinner, secondWinner, positions)
      : null;
  const firstLegHome =
    returnLegHome && firstWinner && secondWinner
      ? returnLegHome === firstWinner
        ? secondWinner
        : firstWinner
      : null;
  const finalOnPenalties = hasAggregateDraw(scores.f1, scores.f2);
  const champion =
    firstLegHome && returnLegHome
      ? resolveTwoLegFinal(
          firstLegHome,
          returnLegHome,
          scores.f1,
          scores.f2,
          scores["f1-p"],
        )
      : null;
  const runnerUp = runnerUpTeamId(champion, firstLegHome, returnLegHome);
  const setScore = (matchId: string, index: 0 | 1, value: string) => {
    const next = scores[matchId]
      ? ([...scores[matchId]] as [number, number])
      : ([0, 0] as [number, number]);
    next[index] = Math.max(0, Number(value) || 0);
    store.setKnockoutScore(championshipId, matchId, next);
  };
  const Row = ({
    matchId,
    index,
    teamId,
    label,
    penaltyMatchId,
    showPenalties,
  }: {
    matchId: string;
    index: 0 | 1;
    teamId?: string | null;
    label: string;
    penaltyMatchId?: string;
    showPenalties?: boolean;
  }) => (
    <div className="flex items-center justify-between gap-2 border-t py-2">
      <span className="flex min-w-0 items-center gap-3 font-bold">
        {teamId ? (
          <TeamBadge team={getTeam(teamId)} size="sm" />
        ) : (
          <img
            className="h-10 w-10 object-contain opacity-50"
            src={placeholder}
            alt="Escudo a definir"
          />
        )}
        <span className="truncate">
          {teamId ? knockoutTeamName(getTeam(teamId)) : label}
        </span>
      </span>
      {teamId && (
        <span className="flex shrink-0 gap-1">
          <ScoreInput
            className={scoreInputWidth(showPenalties)}
            value={scores[matchId]?.[index] ?? ""}
            onChange={(value) => setScore(matchId, index, value)}
            ariaLabel={`Placar de ${knockoutTeamName(getTeam(teamId))}`}
          />
          {showPenalties && penaltyMatchId && (
            <ScoreInput
              className={scoreInputWidth(true)}
              inputClassName="border-amber-300 bg-amber-100 text-amber-950"
              value={scores[penaltyMatchId]?.[index] ?? ""}
              onChange={(value) => setScore(penaltyMatchId, index, value)}
              ariaLabel={`Pênaltis - ${knockoutTeamName(getTeam(teamId))}`}
            />
          )}
        </span>
      )}
    </div>
  );
  const Match = ({
    id,
    title,
    home,
    away,
    penaltyMatchId,
    showPenalties,
  }: {
    id: string;
    title: string;
    home: string;
    away: string;
    penaltyMatchId?: string;
    showPenalties?: boolean;
  }) => (
    <article className="rounded-xl border p-3">
      <b className="mb-2 block text-sm text-emerald-700">{title}</b>
      <Row
        matchId={id}
        index={0}
        teamId={home}
        label=""
        penaltyMatchId={penaltyMatchId}
        showPenalties={showPenalties}
      />
      <Row
        matchId={id}
        index={1}
        teamId={away}
        label=""
        penaltyMatchId={penaltyMatchId}
        showPenalties={showPenalties}
      />
    </article>
  );
  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <p className="text-xs font-bold uppercase text-emerald-700">
            Fases eliminatórias
          </p>
          <h2 className="text-xl font-black">Chaveamento previsto</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="action"
            onClick={() => store.fillKnockout(championshipId)}
          >
            <Dices size={16} />
            Sortear
          </button>
          <button
            className="action"
            onClick={() => store.clearKnockout(championshipId)}
          >
            <Eraser size={16} />
            Limpar
          </button>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <h3 className="mb-3 font-black">Semifinais · jogo único</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Match
              id="s1"
              title="1º × 4º"
              home={firstSemi.homeTeamId}
              away={firstSemi.awayTeamId}
              penaltyMatchId="s1-p"
              showPenalties={isDraw(scores.s1)}
            />
            <Match
              id="s2"
              title="2º × 3º"
              home={secondSemi.homeTeamId}
              away={secondSemi.awayTeamId}
              penaltyMatchId="s2-p"
              showPenalties={isDraw(scores.s2)}
            />
          </div>
        </div>
        <hr />
        <div>
          <h3 className="mb-3 font-black">Final · ida e volta</h3>
          {firstLegHome && returnLegHome ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Match
                id="f1"
                title="Jogo de ida"
                home={firstLegHome}
                away={returnLegHome}
              />
              <Match
                id="f2"
                title="Jogo de volta"
                home={returnLegHome}
                away={firstLegHome}
                penaltyMatchId="f1-p"
                showPenalties={finalOnPenalties}
              />
            </div>
          ) : (
            <article className="rounded-xl border p-3">
              <Row
                matchId=""
                index={0}
                teamId={firstWinner}
                label="Vencedor semifinal 1"
              />
              <Row
                matchId=""
                index={1}
                teamId={secondWinner}
                label="Vencedor semifinal 2"
              />
            </article>
          )}
        </div>
        <hr />
        <div>
          <h3 className="mb-3 font-black">Resultado final</h3>
          <div className="grid gap-3">
            <div className="flex min-h-20 items-center gap-3 rounded-xl bg-amber-200 p-4 text-amber-950">
              {champion ? (
                <>
                  <Trophy className="text-amber-700" />
                  <TeamBadge team={getTeam(champion)} size="md" />
                  <div>
                    <p className="text-xs font-bold uppercase">Campeão</p>
                    <b>{knockoutTeamName(getTeam(champion))}</b>
                  </div>
                </>
              ) : (
                <>
                  <Trophy />
                  <b>À espera da decisão</b>
                </>
              )}
            </div>
            <div className="flex min-h-20 items-center gap-3 rounded-xl bg-slate-200 p-4 text-slate-800">
              {runnerUp ? (
                <>
                  <Medal className="text-slate-500" />
                  <TeamBadge team={getTeam(runnerUp)} size="md" />
                  <div>
                    <p className="text-xs font-bold uppercase">Vice-campeão</p>
                    <b>{knockoutTeamName(getTeam(runnerUp))}</b>
                  </div>
                </>
              ) : (
                <>
                  <Medal className="text-slate-500" />
                  <b>À espera da decisão</b>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

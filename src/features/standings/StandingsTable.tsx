import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { TeamBadge } from "../../components/TeamBadge";
import type { StandingRow, Team } from "../../types";

export function StandingsTable({
  rows,
  teams,
  previousPositions = {},
}: {
  rows: StandingRow[];
  teams: Team[];
  previousPositions?: Record<string, number>;
}) {
  const getTeam = (id: string) => teams.find((team) => team.id === id)!;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-separate border-spacing-0 text-[15px]">
        <thead className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
          <tr>
            <th className="p-4">Pos</th>
            <th className="p-4">Time</th>
            <th
              className="w-14 p-4 text-center"
              aria-label="Variação de posição"
            >
              Δ
            </th>
            <th className="p-4 text-center">Pts</th>
            <th className="p-4 text-center">J</th>
            <th className="hidden p-4 text-center md:table-cell">V</th>
            <th className="hidden p-4 text-center md:table-cell">E</th>
            <th className="hidden p-4 text-center md:table-cell">D</th>
            <th className="hidden p-4 text-center md:table-cell">GP</th>
            <th className="hidden p-4 text-center md:table-cell">GC</th>
            <th className="p-4 text-center">SG</th>
            <th className="hidden p-4 text-center lg:table-cell">Aprov.</th>
            <th className="hidden p-4 lg:table-cell">Últimos 5</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = getTeam(row.teamId);
            const previous = previousPositions[row.teamId];
            const change = previous ? previous - row.position : 0;
            return (
              <motion.tr
                layout
                key={row.teamId}
                className="h-20 border-t hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30"
              >
                <td className="relative p-4 text-base font-black">
                  <span
                    className={`absolute inset-y-2 left-0 w-1 rounded-full ${zone(row.position)}`}
                  />
                  {row.position}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <TeamBadge team={team} size="sm" />
                    <span className="font-bold">{team.name}</span>
                  </div>
                </td>
                <td className="w-14 p-4 text-center">
                  <PositionChange value={change} />
                </td>
                <td className="p-4 text-center text-base font-black">
                  {row.points}
                </td>
                <td className="p-4 text-center">{row.played}</td>
                <td className="hidden p-4 text-center md:table-cell">
                  {row.wins}
                </td>
                <td className="hidden p-4 text-center md:table-cell">
                  {row.draws}
                </td>
                <td className="hidden p-4 text-center md:table-cell">
                  {row.losses}
                </td>
                <td className="hidden p-4 text-center md:table-cell">
                  {row.goalsFor}
                </td>
                <td className="hidden p-4 text-center md:table-cell">
                  {row.goalsAgainst}
                </td>
                <td className="p-4 text-center">
                  {row.goalDifference > 0 ? "+" : ""}
                  {row.goalDifference}
                </td>
                <td className="hidden p-4 text-center lg:table-cell">
                  {row.played
                    ? Math.round((row.points / (row.played * 3)) * 100)
                    : 0}
                  %
                </td>
                <td className="hidden p-4 lg:table-cell">
                  <div className="flex gap-1">
                    {row.form.map((form, index) => (
                      <span
                        key={index}
                        className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white ${form === "V" ? "bg-emerald-600" : form === "E" ? "bg-slate-400" : "bg-rose-600"}`}
                      >
                        {form}
                      </span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function zone(position: number) {
  return position <= 4
    ? "bg-emerald-500"
    : position <= 6
      ? "bg-sky-500"
      : position >= 17
        ? "bg-rose-500"
        : "bg-transparent";
}
function PositionChange({ value }: { value: number }) {
  return value > 0 ? (
    <span className="inline-flex items-center text-xs font-bold text-emerald-600">
      <ArrowUp size={13} />
      {value}
    </span>
  ) : value < 0 ? (
    <span className="inline-flex items-center text-xs font-bold text-rose-600">
      <ArrowDown size={13} />
      {Math.abs(value)}
    </span>
  ) : (
    <span className="inline-flex text-slate-400">
      <Minus size={13} />
    </span>
  );
}

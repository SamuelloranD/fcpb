import type { Team } from "../types";
export function TeamBadge({
  team,
  size = "md",
}: {
  team: Team;
  size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? "h-12 w-12 text-xs" : "h-14 w-14 text-sm";
  return team.badgeUrl ? (
    <img
      className={`${dimensions} shrink-0 object-contain`}
      src={team.badgeUrl}
      alt={`Escudo do ${team.name}`}
    />
  ) : (
    <span
      className={`${dimensions} inline-flex shrink-0 items-center justify-center rounded-full font-black text-white`}
      style={{ backgroundColor: team.color }}
      aria-label={`Escudo do ${team.name}`}
    >
      {team.shortName.slice(0, 3)}
    </span>
  );
}

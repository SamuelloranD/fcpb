import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { copaTeams } from "../data";
import { getChampionships, getMatches } from "../services/api";

export function HomePage() {
  const championships = useQuery({
    queryKey: ["championships"],
    queryFn: getChampionships,
  });
  const games = useQuery({
    queryKey: ["matches", "copa-paraiba-2026"],
    queryFn: () => getMatches("copa-paraiba-2026"),
  });
  if (championships.isLoading || games.isLoading)
    return (
      <div className="panel animate-pulse p-10">Carregando Copa Paraíba…</div>
    );
  if (
    championships.isError ||
    games.isError ||
    !championships.data ||
    !games.data
  )
    return (
      <div className="panel p-10 text-rose-600">
        Não foi possível carregar os dados.
      </div>
    );
  const name = (id: string) =>
    copaTeams.find((team) => team.id === id)?.name ?? id;
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 p-6 text-white sm:p-10">
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-200">
          <Trophy size={16} /> Copa Paraíba 2026
        </p>
        <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
          A Copa Paraíba na palma da sua mão.
        </h1>
        <p className="mt-4 max-w-xl text-emerald-100">
          Acompanhe a classificação, confira os jogos e simule o caminho até a
          decisão.
        </p>
        <Link
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-emerald-900"
          to="/campeonatos/copa-paraiba-2026"
        >
          Abrir Copa Paraíba <ArrowRight size={17} />
        </Link>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">Competição em destaque</h2>
          <span className="text-sm text-[var(--muted)]">Temporada 2026</span>
        </div>
        <div className="grid gap-4">
          {championships.data.map((championship) => (
            <Link
              key={championship.id}
              to={`/campeonatos/${championship.slug}`}
              className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Trophy size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-black">{championship.name}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {championship.format} · {championship.currentRound}ª rodada
                    concluída
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-black">Próximos jogos</h2>
        <div className="panel divide-y">
          {games.data
            .filter((game) => game.status === "scheduled")
            .slice(0, 3)
            .map((game) => (
              <div key={game.id} className="flex items-center gap-3 p-4">
                <CalendarDays className="text-emerald-700" size={18} />
                <span className="font-bold">
                  {name(game.homeTeamId)} × {name(game.awayTeamId)}
                </span>
                <span className="ml-auto text-sm text-[var(--muted)]">
                  {new Date(game.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Play } from "lucide-react";
import { copaTeams } from "../data";
import { getChampionship, getMatches, getStandings } from "../services/api";
import { Simulator } from "../features/simulator/Simulator";
import { StandingsTable } from "../features/standings/StandingsTable";

export function ChampionshipPage() {
  const { slug = "" } = useParams();
  const [tab, setTab] = useState<"table" | "simulator">("table");
  const championship = useQuery({
    queryKey: ["championship", slug],
    queryFn: () => getChampionship(slug),
  });
  const matches = useQuery({
    queryKey: ["matches", "copa-paraiba-2026"],
    queryFn: () => getMatches("copa-paraiba-2026"),
  });
  const table = useQuery({
    queryKey: ["standings", "copa-paraiba-2026"],
    queryFn: () => getStandings("copa-paraiba-2026", "primeira-fase"),
  });
  if (championship.isLoading || matches.isLoading || table.isLoading)
    return (
      <div className="panel animate-pulse p-12">Carregando Copa Paraíba…</div>
    );
  if (
    championship.isError ||
    matches.isError ||
    table.isError ||
    !championship.data ||
    !matches.data ||
    !table.data
  )
    return (
      <div className="panel p-12 text-rose-600">Copa Paraíba indisponível.</div>
    );
  const c = championship.data;
  return (
    <div>
      <section className="mb-6 rounded-3xl bg-emerald-800 p-6 text-white sm:p-8">
        <p className="text-sm font-bold text-emerald-200">
          {c.season} · {c.format}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">{c.name}</h1>
            <p className="mt-2 text-emerald-100">
              Acompanhe cada passo rumo ao título
            </p>
          </div>
        </div>
      </section>
      <div className="mb-5 flex gap-2 overflow-x-auto border-b pb-3">
        <button
          className={`tab ${tab === "table" ? "tab-active" : ""}`}
          onClick={() => setTab("table")}
        >
          Classificação
        </button>
        <button
          className={`tab ${tab === "simulator" ? "tab-active" : ""}`}
          onClick={() => setTab("simulator")}
        >
          Rodadas e simulador
        </button>
      </div>
      {tab === "table" ? (
        <>
          <div className="panel overflow-hidden">
            <StandingsTable rows={table.data} teams={copaTeams} />
          </div>
          <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
            <i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Os quatro primeiros avançam às semifinais.
          </p>
        </>
      ) : (
        <Simulator
          championship={c}
          teams={copaTeams}
          matches={matches.data}
          realRows={table.data}
        />
      )}
    </div>
  );
}

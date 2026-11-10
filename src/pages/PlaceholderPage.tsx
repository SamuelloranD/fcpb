import { Link } from "react-router-dom";
export function PlaceholderPage() {
  return (
    <div className="panel p-10 text-center">
      <h1 className="text-2xl font-black">Em preparação</h1>
      <p className="mt-2 text-[var(--muted)]">
        Esta página fará parte da próxima etapa do FCPB.
      </p>
      <Link className="action mt-5" to="/campeonatos/copa-paraiba-2026">
        Ver Copa Paraíba
      </Link>
    </div>
  );
}

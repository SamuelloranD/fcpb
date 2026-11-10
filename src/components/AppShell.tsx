import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Search, Sun, Trophy } from "lucide-react";

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const toggleTheme = () => document.documentElement.classList.toggle("dark");
  const nav = [
    { to: "/", label: "Início" },
    { to: "/campeonatos/copa-paraiba-2026", label: "Copa Paraíba" },
  ];
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-20 border-b bg-[color:var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-black tracking-tight"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white">
              <Trophy size={19} />
            </span>
            <span>FCPB</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`tab ${location.pathname === item.to ? "tab-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2">
            <button
              className="action-secondary !p-2"
              onClick={toggleTheme}
              aria-label="Alternar tema"
            >
              <Sun className="dark:hidden" size={18} />
              <Moon className="hidden dark:block" size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-[var(--surface)] p-2 md:hidden">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`tab text-xs ${location.pathname === item.to ? "tab-active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

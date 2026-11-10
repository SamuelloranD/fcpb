import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Moon, Sun } from "lucide-react";

export function AppShell({ children }: PropsWithChildren) {
  const toggleTheme = () => document.documentElement.classList.toggle("dark");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-[color:var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="FCPB — Página inicial"
          >
            <img
              src="/fcpb-logo.png"
              alt="FCPB"
              className="h-8 w-auto object-contain sm:h-10"
            />
          </Link>
          <div className="ml-auto flex shrink-0">
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
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:py-8">{children}</main>
      <footer className="border-t px-4 py-5 text-center text-[10px] font-semibold tracking-wide text-[var(--muted)]">
        <a
          href="https://www.linkedin.com/in/samuellorand/"
          target="_blank"
          rel="noreferrer"
          aria-label="Visitar LinkedIn de Samuel Lorand"
          className="inline-flex items-center gap-1 uppercase transition-colors hover:text-[var(--ink)] hover:underline hover:underline-offset-4"
        >
          Powered by: Samuel Lorand
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}

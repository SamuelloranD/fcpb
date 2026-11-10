import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("keeps only the championship link and marks it active by route", () => {
    const homeHtml = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell><div>Conteúdo</div></AppShell>
      </MemoryRouter>,
    );
    const championshipHtml = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/campeonatos/copa-paraiba-2026"]}>
        <AppShell><div>Conteúdo</div></AppShell>
      </MemoryRouter>,
    );

    expect(homeHtml).toContain('href="/campeonatos/copa-paraiba-2026"');
    expect(homeHtml).not.toContain(">Início<");
    expect(homeHtml).toContain('src="/fcpb-logo.png"');
    expect(homeHtml).not.toContain('aria-current="page"');
    expect(championshipHtml).toContain('aria-current="page"');
    expect(homeHtml).toContain("FCPB");
    expect(homeHtml).not.toContain("fixed inset-x-0 bottom-0");
  });
});

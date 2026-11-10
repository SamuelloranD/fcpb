import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("keeps navigation focused on the home logo and theme control", () => {
    const homeHtml = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/"]}>
        <AppShell><div>Conteúdo</div></AppShell>
      </MemoryRouter>,
    );

    expect(homeHtml).not.toContain('href="/campeonatos/copa-paraiba-2026"');
    expect(homeHtml).not.toContain(">Início<");
    expect(homeHtml).toContain('src="/fcpb-logo.png"');
    expect(homeHtml).toContain("FCPB");
    expect(homeHtml).toContain("Alternar tema");
    expect(homeHtml).not.toContain("fixed inset-x-0 bottom-0");
  });
});

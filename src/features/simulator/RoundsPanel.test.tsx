import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "../../data/copaParaiba";
import { RoundsPanel } from "./RoundsPanel";

describe("RoundsPanel", () => {
  it("renders compact matches with crests and scores but without club names", () => {
    const html = renderToStaticMarkup(
      <RoundsPanel
        championship={copaParaiba}
        teams={copaTeams}
        matches={copaMatches.slice(0, 1)}
        compact
        onClose={() => undefined}
      />,
    );

    expect(html).toContain('aria-label="Fechar simulador"');
    expect(html).toContain('alt="Escudo do Treze"');
    expect(html).toContain('alt="Escudo do Esporte-PB"');
    expect(html).not.toContain(">Treze<");
    expect(html).toContain("07/11");
    expect(html).toContain("max-w-[17rem]");
  });
});

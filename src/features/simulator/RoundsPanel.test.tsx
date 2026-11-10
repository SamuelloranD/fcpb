import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { copaMatches, copaParaiba, copaTeams } from "../../data/copaParaiba";
import { RoundsPanel } from "./RoundsPanel";

describe("RoundsPanel", () => {
  it("keeps desktop score entry keyboard-only", () => {
    const scheduledMatch = copaMatches.find((match) => match.status === "scheduled")!;
    const html = renderToStaticMarkup(
      <RoundsPanel
        championship={copaParaiba}
        teams={copaTeams}
        matches={[scheduledMatch]}
      />,
    );

    expect(html).not.toContain("Aumentar placar");
    expect(html).not.toContain("Diminuir placar");
  });

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

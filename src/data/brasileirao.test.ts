import { describe, expect, it } from "vitest";
import { brasileirao, matches, teams } from "./brasileirao";

describe("mock do Brasileirão", () => {
  it("offers 20 clubes e jogos finalizados e futuros para a simulação", () => {
    expect(brasileirao.slug).toBe("brasileirao-serie-a");
    expect(teams).toHaveLength(20);
    expect(matches.some((match) => match.status === "finished")).toBe(true);
    expect(matches.some((match) => match.status === "scheduled")).toBe(true);
  });
});

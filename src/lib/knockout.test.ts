import { describe, expect, it } from "vitest";
import {
  resolveSingleMatch,
  resolveTwoLegFinal,
  selectFinalReturnHome,
} from "./knockout";

describe("resolveSingleMatch", () => {
  it("avança o time com mais gols no jogo único", () => {
    expect(resolveSingleMatch("treze", "serra", [2, 1])).toBe("treze");
  });

  it("exige pênaltis para um empate e usa o vencedor dos pênaltis", () => {
    expect(resolveSingleMatch("treze", "serra", [1, 1])).toBeNull();
    expect(resolveSingleMatch("treze", "serra", [1, 1], [4, 3])).toBe("treze");
  });
});

describe("resolveTwoLegFinal", () => {
  it("soma os dois jogos da final antes de definir o campeão", () => {
    expect(resolveTwoLegFinal("treze", "serra", [1, 0], [2, 0])).toBe("serra");
  });

  it("exige pênaltis para empate no agregado", () => {
    expect(resolveTwoLegFinal("treze", "serra", [1, 0], [1, 0])).toBeNull();
    expect(resolveTwoLegFinal("treze", "serra", [1, 0], [1, 0], [5, 4])).toBe(
      "treze",
    );
  });
});

describe("selectFinalReturnHome", () => {
  it("escolhe o finalista de melhor posição na primeira fase para a volta", () => {
    expect(
      selectFinalReturnHome("campinense", "treze", { campinense: 3, treze: 2 }),
    ).toBe("treze");
  });
});

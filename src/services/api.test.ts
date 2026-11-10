import { describe, expect, it } from "vitest";
import { getChampionship, getRounds } from "./api";

describe("serviços mockados", () => {
  it("retorna a Copa Paraíba e suas rodadas sem uma API configurada", async () => {
    expect((await getChampionship("copa-paraiba-2026")).name).toBe(
      "Copa Paraíba",
    );
    expect(await getRounds("copa-paraiba-2026")).toHaveLength(5);
  });
});

import { describe, expect, it } from "vitest";
import { stepScore } from "./ScoreInput";

describe("stepScore", () => {
  it("increments and decrements scores without going below zero", () => {
    expect(stepScore(2, 1)).toBe(3);
    expect(stepScore(2, -1)).toBe(1);
    expect(stepScore(0, -1)).toBe(0);
  });
});

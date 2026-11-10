import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ScoreInput, stepScore } from "./ScoreInput";

describe("ScoreInput", () => {
  it("increments and decrements scores without going below zero", () => {
    expect(stepScore(2, 1)).toBe(3);
    expect(stepScore(2, -1)).toBe(1);
    expect(stepScore(0, -1)).toBe(0);
  });

  it("can hide steppers for keyboard-only mobile score entry", () => {
    const html = renderToStaticMarkup(<ScoreInput value={0} onChange={() => undefined} showStepper={false} selectOnFocus />);

    expect(html).not.toContain("Aumentar placar");
  });
});

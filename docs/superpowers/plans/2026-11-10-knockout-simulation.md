# Knockout Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Copa Paraíba users to simulate semifinals and a two-leg final from the first-phase scenario.

**Architecture:** A pure knockout resolver receives semifinal and final score overrides, derives winners, and requires a penalties result only for tied aggregates. The simulator store persists those overrides with the first-phase scenario; the UI renders score fields only after all prerequisite teams are known.

**Tech Stack:** React, TypeScript, Zustand, Vitest, Framer Motion.

**Spec:** `docs/superpowers/specs/2026-11-09-copa-paraiba-focus-design.md`

## Global Constraints

- Semifinals are single matches: 1st x 4th and 2nd x 3rd.
- Final has two matches and better first-phase rank hosts the return leg.
- A tied match or aggregate needs manual penalty scores; no winner is inferred before them.
- All knockout overrides remain local and never modify official matches.

---

### Task 1: Create the pure knockout resolver

**Files:**
- Create: `src/lib/knockout.ts`, `src/lib/knockout.test.ts`

**Interfaces:**
- Produces: `resolveSingleMatch(home, away, score, penalties)` and `resolveTwoLegFinal(firstLeg, secondLeg, penalties)`.

- [ ] **Step 1: Write a failing test for a semifinal winner and a tied semifinal resolved by penalties.**

```ts
expect(resolveSingleMatch('treze', 'serra', [2, 1])).toBe('treze')
expect(resolveSingleMatch('treze', 'serra', [1, 1], [4, 3])).toBe('treze')
```

- [ ] **Step 2: Run `npm test -- src/lib/knockout.test.ts` and observe the missing-module failure.**

- [ ] **Step 3: Implement winner selection and final aggregate selection.**

```ts
return homeScore === awayScore ? penaltyWinner(home, away, penalties) : homeScore > awayScore ? home : away
```

- [ ] **Step 4: Run `npm test -- src/lib/knockout.test.ts` and confirm PASS.**

### Task 2: Persist knockout scenario state and render editors

**Files:**
- Modify: `src/features/simulator/simulationStore.ts`, `src/features/simulator/Simulator.tsx`
- Create: `src/features/simulator/KnockoutSimulator.tsx`

**Interfaces:**
- Consumes: `buildKnockoutBracket`, resolver exports, `Team`.
- Produces: editable semifinal and final cards with final participants derived from semifinal winners.

- [ ] **Step 1: Add typed local score and penalty overrides keyed by `semi-1`, `semi-2`, `final-ida`, and `final-volta`.**

```ts
type KnockoutScores = Record<string, [number, number]>
```

- [ ] **Step 2: Render semifinal editors, then render final editors only when both winners are determined.**

- [ ] **Step 3: Render penalty inputs only for tied semifinal or final aggregate.**

- [ ] **Step 4: Run `npm test && npm run build` and confirm both exit with status zero.**

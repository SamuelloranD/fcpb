# Copa Paraíba Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Copa Paraíba 2026 the FCPB's single visible, locally managed tournament with a first-phase simulator and derived knockout bracket.

**Architecture:** `copaParaiba.ts` becomes the active source for local services and stores official results as finished matches. A pure bracket module derives semifinal pairings and final home advantage from simulated standings, while the existing simulator keeps only future-score overrides.

**Tech Stack:** React, TypeScript, Vite, TanStack Query, Zustand, Framer Motion, Vitest, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-11-09-copa-paraiba-focus-design.md`

## Global Constraints

- Copa Paraíba is the only championship listed or linked in the interface.
- Brasileirão source and API readiness remain in code but do not appear in active local results.
- Official Copa results are manual `finished` matches; only `scheduled` matches are simulatable.
- Semifinals are single matches: 1st x 4th and 2nd x 3rd; the final is two legs with the better first-phase rank at home in the return leg.
- Use the supplied club crests as local Vite assets.

---

### Task 1: Add Copa Paraíba domain data and crests

**Files:**
- Create: `src/data/copaParaiba.ts`, `src/data/copaParaiba.test.ts`, `src/assets/teams/*`
- Modify: `src/data/index.ts`, `src/types/competition.ts`

**Interfaces:**
- Produces: `copaParaiba`, `copaTeams`, and `copaMatches` with the documented five rounds.

- [ ] **Step 1: Write a failing test for the initial six-club table source**

```ts
expect(copaTeams).toHaveLength(6)
expect(copaMatches.filter((match) => match.status === 'finished')).toHaveLength(3)
expect(copaParaiba.slug).toBe('copa-paraiba-2026')
```

- [ ] **Step 2: Run `npm test -- src/data/copaParaiba.test.ts` and observe the missing-module failure.**

- [ ] **Step 3: Copy each supplied image into `src/assets/teams` and implement the six clubs, first-round scores, and the four scheduled rounds.**

```ts
{ id: 'treze', name: 'Treze', shortName: 'TRE', badgeUrl: trezeCrest }
```

- [ ] **Step 4: Run `npm test -- src/data/copaParaiba.test.ts` and confirm PASS.**

### Task 2: Derive and test playoff pairings

**Files:**
- Create: `src/lib/bracket.ts`, `src/lib/bracket.test.ts`
- Modify: `src/types/competition.ts`

**Interfaces:**
- Produces: `buildKnockoutBracket(rows: StandingRow[]): KnockoutBracket`.

- [ ] **Step 1: Write a failing test for 1st x 4th, 2nd x 3rd and return-leg final home team.**

```ts
expect(buildKnockoutBracket(rows).semifinals[0]).toMatchObject({ homeTeamId: 'first', awayTeamId: 'fourth' })
expect(buildKnockoutBracket(rows).final.returnLegHomeTeamId).toBe('first')
```

- [ ] **Step 2: Run `npm test -- src/lib/bracket.test.ts` and observe the missing-module failure.**

- [ ] **Step 3: Implement pure derived pairings.**

```ts
return { semifinals: [{ homeTeamId: rows[0].teamId, awayTeamId: rows[3].teamId }], final: { returnLegHomeTeamId: rows[0].teamId } }
```

- [ ] **Step 4: Run `npm test -- src/lib/bracket.test.ts` and confirm PASS.**

### Task 3: Make Copa Paraíba the active local experience

**Files:**
- Modify: `src/services/api.ts`, `src/pages/HomePage.tsx`, `src/pages/ChampionshipPage.tsx`, `src/App.tsx`
- Create: `src/features/bracket/KnockoutBracket.tsx`

**Interfaces:**
- Consumes: `copaParaiba`, `copaTeams`, `copaMatches`, `buildKnockoutBracket`.
- Produces: active routes `/` and `/campeonatos/copa-paraiba-2026` and Fases tab.

- [ ] **Step 1: Route local service calls to Copa Paraíba and retain remote `VITE_API_URL` fetches.**

```ts
return baseUrl ? request('/api/championships') : [copaParaiba]
```

- [ ] **Step 2: Update home and championship queries to use Copa Paraíba IDs and slug.**

- [ ] **Step 3: Render a responsive Fases tab from `buildKnockoutBracket(simulatedRows)`.**

- [ ] **Step 4: Run `npm test && npm run build` and confirm both exit with status zero.**

### Task 4: Document manual round updates and verify preview

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: instructions for changing a scheduled fixture into a finished official result.

- [ ] **Step 1: Document the `homeScore`, `awayScore`, and `status: 'finished'` update procedure.**

- [ ] **Step 2: Run `npm test && npm run build`.**

- [ ] **Step 3: Start `npm run dev -- --host 127.0.0.1` and check `/campeonatos/copa-paraiba-2026` returns HTTP 200.**

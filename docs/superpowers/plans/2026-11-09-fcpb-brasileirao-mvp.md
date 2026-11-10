# FCPB Brasileirão MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the local FCPB MVP with a working Brasileirão Série A standings, rounds, and score simulation experience.

**Architecture:** React pages retrieve typed domain objects from `services/api.ts`, which selects mocks or Laravel REST endpoints based on `VITE_API_URL`. Pure competition functions derive standings from immutable matches and simulator state holds only score overrides, persisted per championship.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui-compatible primitives, React Router, TanStack Query, Framer Motion, Zustand, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-09-fcpb-design.md`

## Global Constraints

- All visible copy must be Brazilian Portuguese.
- First delivery runs locally only; do not register or deploy a Site.
- Use `VITE_API_URL` for Laravel REST when configured; otherwise use immutable mocks.
- Keep scoring and ordering rules pure and independently unit-tested.
- Never mutate original mock matches from simulation interactions.
- Maintain keyboard-accessible score inputs, visible focus, responsive layout, and light/dark theme.

---

### Task 1: Scaffold the local application and visual foundation

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/components/layout/AppShell.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: `AppShell({ children }: PropsWithChildren)` and shared CSS tokens for semantic zones and themes.

- [ ] **Step 1: Add the Vite scripts and development dependencies**

```json
{"scripts":{"dev":"vite","build":"tsc -b && vite build","test":"vitest run"}}
```

- [ ] **Step 2: Create the React entry point and mount `App` into `#root`**

```tsx
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
```

- [ ] **Step 3: Define Tailwind layers, light/dark CSS variables, fonts, focus rings, and base page styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: Vite completes and creates `dist/`.

### Task 2: Define the competition domain and immutable Brasileirão mock data

**Files:**
- Create: `src/types/competition.ts`, `src/types/index.ts`
- Create: `src/data/teams.ts`, `src/data/brasileirao.ts`, `src/data/index.ts`
- Test: `src/data/brasileirao.test.ts`

**Interfaces:**
- Produces: `Championship`, `Phase`, `Team`, `Match`, `Round`, `StandingRow`, `SimulationState`, `brasileirao`, `teams`, and `matches`.

- [ ] **Step 1: Write a failing data-shape test**

```ts
expect(brasileirao.slug).toBe('brasileirao-serie-a');
expect(teams).toHaveLength(20);
expect(matches.some((match) => match.status === 'scheduled')).toBe(true);
```

- [ ] **Step 2: Run the test to verify the missing module failure**

Run: `npm test -- src/data/brasileirao.test.ts`

Expected: FAIL because `brasileirao` is not exported.

- [ ] **Step 3: Define readonly-friendly domain types and mock three completed rounds plus future fixtures**

```ts
export type MatchStatus = 'finished' | 'scheduled';
export interface Match { id: string; round: number; homeTeamId: string; awayTeamId: string; homeScore: number | null; awayScore: number | null; status: MatchStatus; }
```

- [ ] **Step 4: Run the data-shape test**

Run: `npm test -- src/data/brasileirao.test.ts`

Expected: PASS.

### Task 3: Build and test the pure standings engine

**Files:**
- Create: `src/lib/standings.ts`, `src/lib/standings.test.ts`

**Interfaces:**
- Consumes: `Team`, `Match`, `StandingRow`, `Tiebreaker`.
- Produces: `calculateStandings(teams, matches, tiebreakers): StandingRow[]` and `applyScoreOverrides(matches, overrides): Match[]`.

- [ ] **Step 1: Write failing unit tests for win/draw/loss, goal difference, ordering, and score overrides**

```ts
expect(calculateStandings([a, b], [finished(a, b, 2, 1)], criteria)[0]).toMatchObject({ teamId: a.id, points: 3, wins: 1, goalDifference: 1 });
expect(applyScoreOverrides([scheduled], { [scheduled.id]: [1, 0] })[0].homeScore).toBe(1);
```

- [ ] **Step 2: Run the unit tests to verify they fail**

Run: `npm test -- src/lib/standings.test.ts`

Expected: FAIL because the functions do not exist.

- [ ] **Step 3: Implement point accumulation, sort criteria, last-five form, direct-head-to-head mini-table, and immutable overrides**

```ts
export const calculateStandings = (teams: Team[], matches: Match[], criteria: Tiebreaker[]) => /* sorted rows */;
```

- [ ] **Step 4: Run engine tests**

Run: `npm test -- src/lib/standings.test.ts`

Expected: PASS.

### Task 4: Add typed mock/API services and simulation persistence

**Files:**
- Create: `src/services/api.ts`, `src/services/api.test.ts`
- Create: `src/features/simulator/simulationStore.ts`

**Interfaces:**
- Produces: `getChampionships()`, `getChampionship(slug)`, `getStandings(championshipId, phaseId)`, `getRounds(championshipId)`, `getMatches(championshipId)`, `getTeam(id)`.
- Produces: `useSimulationStore` with `setScore`, `clearAll`, `resetRound`, `fillRound`, and `hydrate`.

- [ ] **Step 1: Write a failing mock-service test**

```ts
expect((await getChampionship('brasileirao-serie-a')).id).toBe('brasileirao');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/services/api.test.ts`

Expected: FAIL because `api.ts` does not exist.

- [ ] **Step 3: Implement mock fallback and REST endpoint selection**

```ts
const apiUrl = import.meta.env.VITE_API_URL;
export async function getChampionship(slug: string) { return apiUrl ? request(`/api/championships/${slug}`) : getMockChampionship(slug); }
```

- [ ] **Step 4: Implement the persisted Zustand scenario store without writing to match data**

```ts
type ScoreOverride = Record<string, [number, number]>;
```

- [ ] **Step 5: Run service and engine tests**

Run: `npm test -- src/services/api.test.ts src/lib/standings.test.ts`

Expected: PASS.

### Task 5: Implement routing, data queries, and reusable football UI

**Files:**
- Create: `src/components/TeamBadge.tsx`, `src/components/ThemeToggle.tsx`, `src/components/LoadingState.tsx`, `src/components/ErrorState.tsx`
- Create: `src/pages/HomePage.tsx`, `src/pages/ChampionshipPage.tsx`, `src/pages/TeamPage.tsx`, `src/pages/MatchPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: API service exports and `TeamBadge({ team, size? })`.
- Produces: router paths `/`, `/campeonatos/:slug`, `/times/:id`, `/jogos/:id`.

- [ ] **Step 1: Configure `QueryClientProvider` and routes**

```tsx
<Route path="/campeonatos/:slug" element={<ChampionshipPage />} />
```

- [ ] **Step 2: Build `TeamBadge` with initials and a future image URL fallback**

```tsx
return team.badgeUrl ? <img alt={`Escudo do ${team.name}`} src={team.badgeUrl} /> : <span aria-label={`Escudo do ${team.name}`}>{team.shortName}</span>;
```

- [ ] **Step 3: Build shell navigation, theme control, and home cards using query loading/error states**

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: PASS.

### Task 6: Implement standings and round browsing

**Files:**
- Create: `src/features/standings/StandingsTable.tsx`, `src/features/standings/ZoneLegend.tsx`
- Create: `src/features/rounds/RoundBrowser.tsx`, `src/features/rounds/MatchCard.tsx`
- Modify: `src/pages/ChampionshipPage.tsx`

**Interfaces:**
- Consumes: standings engine, fetched teams/matches, championship zones.
- Produces: `StandingsTable({ rows, teams, previousPositions? })` and `RoundBrowser({ matches, teams })`.

- [ ] **Step 1: Render all standings columns on desktop and compact columns on mobile**

```tsx
<th scope="col">Pts</th><th scope="col">J</th><th scope="col" className="hidden md:table-cell">Aproveitamento</th>
```

- [ ] **Step 2: Add color strips and accessible zone legend**

```tsx
<span className={zoneClass(row.position)} aria-label={zoneLabel(row.position)} />
```

- [ ] **Step 3: Add previous/next round controls and result or kickoff display**

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: PASS.

### Task 7: Implement the interactive simulator

**Files:**
- Create: `src/features/simulator/Simulator.tsx`, `src/features/simulator/ScoreInput.tsx`, `src/features/simulator/SimulatorActions.tsx`, `src/features/simulator/shareScenario.ts`
- Modify: `src/pages/ChampionshipPage.tsx`, `src/features/standings/StandingsTable.tsx`
- Test: `src/features/simulator/shareScenario.test.ts`

**Interfaces:**
- Consumes: simulation store and `calculateStandings`.
- Produces: simulator score editors, share encode/decode helpers, and animated position deltas.

- [ ] **Step 1: Write failing scenario serialization tests**

```ts
expect(decodeScenario(encodeScenario({ 'm-1': [2, 1] }))).toEqual({ 'm-1': [2, 1] });
```

- [ ] **Step 2: Run the serialization test to verify it fails**

Run: `npm test -- src/features/simulator/shareScenario.test.ts`

Expected: FAIL because the helper is absent.

- [ ] **Step 3: Implement score inputs that lock finished matches and use labels and numeric keyboard controls**

```tsx
<input aria-label={`Placar de ${home.name}`} inputMode="numeric" min={0} disabled={match.status === 'finished'} />
```

- [ ] **Step 4: Recalculate simulated standings from immutable overrides and animate changed rows**

```tsx
<motion.tr layout transition={{ duration: 0.2 }} />
```

- [ ] **Step 5: Add clear, reset round, random, and all-home/draw/away actions plus URL hydration**

- [ ] **Step 6: Run simulator tests and production build**

Run: `npm test -- src/features/simulator/shareScenario.test.ts && npm run build`

Expected: PASS.

### Task 8: Final verification and local handoff

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: local setup instructions, supported routes, test command, and note about `VITE_API_URL`.

- [ ] **Step 1: Document local commands and Laravel API switch**

```md
npm install
npm run dev
npm test
```

- [ ] **Step 2: Run all tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: PASS and `dist/` is generated.

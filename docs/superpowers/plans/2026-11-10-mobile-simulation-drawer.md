# Painel móvel de simulação da primeira fase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o simulador de rodadas em um painel lateral compacto somente no mobile, mantendo o desktop com rodadas à esquerda e classificação/mata-mata à direita.

**Architecture:** Extrair o conteúdo de rodadas de `Simulator` para uma unidade reutilizável com duas apresentações: completa para desktop e compacta para o painel móvel. O componente principal mantém a store atual e controla apenas a abertura local do painel móvel; assim, cada alteração de placar atualiza imediatamente a classificação e o chaveamento já existentes.

**Tech Stack:** React, TypeScript, Tailwind CSS, Zustand, Lucide React, Vitest, React DOM server rendering.

**Spec:** `docs/superpowers/specs/2026-11-10-mobile-simulation-drawer-design.md`

## Global Constraints

- Desktop (`lg` ou maior): rodadas à esquerda; classificação e mata-mata à direita.
- Mobile (abaixo de `lg`): classificação como conteúdo principal e painel lateral de rodadas acionado por botão.
- Painel móvel: jogos sem nomes de clubes, apenas escudos, placares e data.
- Não alterar contratos da store, regras de classificação, mata-mata, sorteio ou limpeza.
- Resultados oficiais permanecem bloqueados.
- Inputs mobile continuam numéricos, sem steppers, e selecionam o valor ao receber foco.

---

### Task 1: Extrair e testar o painel de rodadas

**Files:**
- Create: `src/features/simulator/RoundsPanel.tsx`
- Create: `src/features/simulator/RoundsPanel.test.tsx`
- Modify: `src/features/simulator/Simulator.tsx`

**Interfaces:**
- Consumes: `Championship`, `Match[]`, `Team[]`, `ScoreInput`, `TeamBadge`, `useSimulationStore`, `formatMatchDate`.
- Produces: `RoundsPanel({ championship, teams, matches, compact, onClose? })`, onde `compact` alterna entre jogos completos e jogos só com escudos.

- [ ] **Step 1: Write the failing test**

```tsx
it("renders the compact round panel without club names", () => {
  const html = renderToStaticMarkup(
    <RoundsPanel
      championship={copaParaiba}
      teams={copaTeams}
      matches={copaMatches.slice(0, 1)}
      compact
    />,
  );

  expect(html).toContain('aria-label="Fechar simulador"');
  expect(html).toContain('aria-label="Escudo de Treze"');
  expect(html).not.toContain(">Treze<");
  expect(html).toContain("07/11");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/simulator/RoundsPanel.test.tsx`

Expected: FAIL because `RoundsPanel` does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function RoundsPanel({
  championship, teams, matches, compact, onClose,
}: RoundsPanelProps) {
  const store = useSimulationStore();
  const overrides = store.scenarios[championship.id] ?? {};

  return (
    <section className={compact ? "h-full overflow-y-auto panel" : "panel p-4 sm:p-5"}>
      {onClose && (
        <button aria-label="Fechar simulador" onClick={onClose}>
          <X />
        </button>
      )}
      {/* cabeçalho, ações e rodadas usam a store existente */}
    </section>
  );
}
```

Implementar `CompactScoreRow` com a grade `escudo | input | × | input | escudo`, `TeamBadge size="xs"`, `ScoreInput showStepper={false} selectOnFocus` e `aria-label` nos escudos. A linha completa preserva o visual desktop e os nomes atuais.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/simulator/RoundsPanel.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/simulator/RoundsPanel.tsx src/features/simulator/RoundsPanel.test.tsx src/features/simulator/Simulator.tsx
git commit -m "feat: extract reusable rounds simulator panel"
```

### Task 2: Compor o layout responsivo e o drawer móvel

**Files:**
- Modify: `src/features/simulator/Simulator.tsx`
- Modify: `src/features/simulator/Simulator.test.tsx`

**Interfaces:**
- Consumes: `RoundsPanel` da Task 1 e `useState<boolean>`.
- Produces: botão de abertura do simulador móvel, overlay de fechamento e layout desktop restaurado.

- [ ] **Step 1: Write the failing test**

```tsx
it("keeps the desktop columns and provides a mobile drawer trigger", () => {
  const html = renderToStaticMarkup(<Simulator {...simulatorProps} />);

  expect(html).toContain("xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]");
  expect(html).toContain('aria-label="Abrir simulador de rodadas"');
  expect(html).toContain("lg:hidden");
  expect(html).toContain("hidden lg:block");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/simulator/Simulator.test.tsx`

Expected: FAIL because the restored desktop class and drawer trigger are absent.

- [ ] **Step 3: Write minimal implementation**

```tsx
const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

<div className="lg:hidden">
  <button
    aria-label="Abrir simulador de rodadas"
    className="action"
    onClick={() => setIsMobilePanelOpen(true)}
  >
    <Play size={16} /> Simular rodadas
  </button>
</div>

<div className="hidden lg:block">
  <RoundsPanel {...roundsProps} compact={false} />
</div>

{isMobilePanelOpen && (
  <div className="fixed inset-0 z-50 lg:hidden">
    <button aria-label="Fechar painel do simulador" className="absolute inset-0 bg-slate-950/35" onClick={() => setIsMobilePanelOpen(false)} />
    <aside className="absolute inset-y-0 right-0 w-[min(88vw,24rem)] shadow-2xl">
      <RoundsPanel {...roundsProps} compact onClose={() => setIsMobilePanelOpen(false)} />
    </aside>
  </div>
)}
```

Restaurar o contêiner desktop para `xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]`: `RoundsPanel` na primeira coluna; classificação e `KnockoutBracket` em uma pilha na segunda. No mobile, mostrar classificação e a ação de abrir o painel; não renderizar a lista completa de rodadas no fluxo.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/simulator/Simulator.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run the complete verification**

Run: `npm test; npm run build`

Expected: all tests pass and Vite completes a production build with exit code 0.

- [ ] **Step 6: Commit**

```bash
git add src/features/simulator/Simulator.tsx src/features/simulator/Simulator.test.tsx
git commit -m "feat: add mobile rounds simulation drawer"
```

# Premium Home Refactor Implementation Plan

**Goal:** Refatorar a home da FCPB para uma experiência esportiva premium, destacando a simulação e mantendo todos os dados e fluxos atuais.

**Architecture:** Reutilizar a fonte atual de jogos e o cálculo de classificação para derivar os indicadores, confrontos e Top 4. Concentrar a composição visual em componentes de apresentação da home e ajustar o AppShell somente para a navegação mobile compacta.

**Constraints:** Não modificar rotas, store, regras de classificação, simulação ou dados; manter claro/escuro e eliminar overflow horizontal entre 320px e desktop.

### Task 1: Dados e componentes da home

- [ ] Criar teste de estado derivado para líder, próxima rodada, Top 4 e jogos.
- [ ] Implementar componentes reutilizáveis para indicador, confronto e linha de classificação.
- [ ] Validar com o teste focado.

### Task 2: Composição responsiva

- [ ] Refatorar hero, indicadores e grade principal com a referência como direção.
- [ ] Criar composição CSS/SVG leve de troféu e chaveamento exclusiva do desktop.
- [ ] Garantir ações para simulador e classificação, cards de confronto compactos e Top 4 responsivo.
- [ ] Ajustar navegação mobile no AppShell, preservando rotas e tema.

### Task 3: Verificação

- [ ] Rodar toda a suíte de testes.
- [ ] Gerar build de produção.
- [ ] Inspecionar visualmente os breakpoints disponíveis e os temas.

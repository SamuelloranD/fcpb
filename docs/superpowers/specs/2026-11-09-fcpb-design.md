# FCPB — desenho da primeira entrega

## Objetivo

Construir localmente o FCPB, uma aplicação responsiva em português do Brasil para acompanhar campeonatos de futebol e simular cenários. A primeira entrega concentra-se no Brasileirão Série A, com classificação, rodadas e simulador de placares futuros funcionando de ponta a ponta.

## Escopo da primeira entrega

- React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query e Framer Motion.
- Home, páginas de campeonato, time e jogo; a experiência completa será a de `/campeonatos/brasileirao-serie-a`.
- Aba de classificação com zonas semânticas, últimos cinco resultados e visual compacto para celular.
- Aba de rodadas com navegação por rodada e partidas realizadas/futuras.
- Aba de simulador com placares editáveis para partidas futuras, classificação recalculada e variação de posições.
- Ações para limpar cenário, resetar rodada, gerar resultados realistas e aplicar resultado-padrão por rodada.
- Persistência de palpites por campeonato em `localStorage` e cenário compartilhável codificado na URL.
- Tema claro/escuro, respeitando a preferência do sistema, e navegação inferior no celular.

## Arquitetura

```text
src/
  data/                 mocks imutáveis do Brasileirão
  features/
    standings/          tabela, zonas e indicadores de posição
    simulator/          edição de palpites e controles do cenário
    bracket/            base reservada para chaveamentos futuros
  lib/                  regras puras de competição e simulação
  services/api.ts       fonte mock ou API Laravel, conforme VITE_API_URL
  types/                contratos de domínio compartilhados
  pages/                composições por rota
  components/           componentes visuais reutilizáveis, incluindo TeamBadge
```

As telas acessam dados exclusivamente pelos serviços tipados. Sem `VITE_API_URL`, esses serviços retornam mocks de `src/data`; com a variável configurada, fazem `fetch` aos endpoints REST planejados do Laravel. O estado de simulação é separado dos dados originais e persistido por campeonato.

## Domínio e cálculos

Os tipos incluem `Championship`, `Phase`, `Group`, `Team`, `Match`, `Round`, `StandingRow` e `SimulationState`. O modelo suporta fases ordenadas de pontos corridos, grupos e mata-mata, embora a UI inicial implemente apenas pontos corridos.

As regras de classificação serão funções puras e testáveis: três pontos por vitória, um por empate, saldo e gols marcados; a configuração do campeonato determina a ordem dos critérios. A estrutura incluirá confronto direto para empates, sem depender de efeitos da interface. Palpites são aplicados sobre uma cópia derivada das partidas futuras, sem mutar os mocks.

## Experiência

A home destaca o Brasileirão, jogos próximos e resultados recentes. O cabeçalho do campeonato exibe a rodada atual e uma ação para abrir o simulador. Em desktop, partidas editáveis e classificação simulada aparecem lado a lado. Em celular, a tabela compacta prioriza posição, time, jogos, saldo e pontos, com as demais colunas disponíveis por rolagem horizontal ou painel.

Cada mudança de placar atualiza instantaneamente a classificação e anima a reordenação. Indicadores mostram quantas posições cada clube subiu ou caiu em relação à tabela real. Partidas já concluídas são bloqueadas. Os campos terão rótulos acessíveis e ordem natural de teclado.

## Estados e qualidade

Cada tela terá estados de carregamento, vazio e falha. Componentes apresentarão foco visível, contraste adequado e suporte a tema claro/escuro. Resultados de classificação e simulação serão memorizados quando apropriado.

Vitest cobrirá atribuição de pontos, saldo, ordenação, desempates e atualização da tabela ao registrar palpites. A camada de serviços será testada no modo mock. A primeira entrega será validada por build e testes automatizados.

## Próximas fases

Após a base do Brasileirão, serão adicionados mocks e interfaces para Campeonato Paraibano, Copa do Nordeste e torneio misto. As fases de grupos e mata-mata usarão o mesmo domínio e alimentarão um bracket reativo; posteriormente será possível simular fases seguintes e oferecer probabilidades por Monte Carlo em Web Worker.

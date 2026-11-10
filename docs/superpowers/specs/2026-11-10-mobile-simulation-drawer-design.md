# Painel móvel de simulação da primeira fase

## Objetivo

No mobile, permitir que a pessoa altere placares enquanto acompanha a classificação simulada no mesmo contexto visual. O simulador passa a ser um painel lateral à direita, com jogos compactos e identificados somente pelos escudos.

## Comportamento responsivo

- Em telas `lg` e maiores, manter exatamente a composição atual: rodadas na coluna esquerda; classificação e mata-mata na coluna direita.
- Abaixo de `lg`, a classificação continua como conteúdo principal.
- O simulador é aberto por uma ação de “Simular” e ocupa um painel ancorado ao lado direito, sobre o conteúdo. Ao fechar, volta-se à classificação sem perder os placares informados.
- O mata-mata permanece no fluxo normal da página, após a área de classificação.

## Painel de rodadas

- Cabeçalho compacto com título, fechar, Sortear e Limpar.
- Rodadas mostradas em blocos compactos.
- Cada partida usa apenas escudo do mandante, placar, separador, placar e escudo do visitante; nomes não são exibidos.
- A data permanece discreta abaixo da partida.
- Resultados oficiais continuam bloqueados.
- Os placares atualizam a store existente, portanto a classificação e o chaveamento reagem imediatamente.

## Componentes e dados

- Extrair o conteúdo atual de rodadas para um componente reutilizável de painel, sem alterar o contrato da store.
- O componente principal decide, via classes responsivas, entre o layout desktop existente e o disparador/painel móvel.
- Reutilizar `TeamBadge`, `ScoreInput`, formatação de data, sorteio e limpeza atuais.

## Acessibilidade e interação

- O painel terá rótulo acessível e botão de fechamento.
- Um fundo translúcido fecha o painel ao toque.
- Em mobile, os inputs seguem numéricos, sem setas, e selecionam o valor ao receber foco.

## Testes

- Cobrir a presença do painel móvel, do disparador e da variante compacta sem nomes.
- Cobrir que o layout desktop continua renderizando o simulador completo em sua coluna original.
- Manter os testes de sorteio, limpeza e atualização da classificação.

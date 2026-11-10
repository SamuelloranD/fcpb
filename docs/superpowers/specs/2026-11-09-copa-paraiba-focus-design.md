# FCPB — foco na Copa Paraíba 2026

## Objetivo

Alterar o FCPB para atender torcedores da Copa Paraíba 2026. A Copa Paraíba será o único campeonato exposto na interface enquanto seus dados forem mantidos manualmente. O Brasileirão permanece oculto e reservado para a futura integração de API.

## Campeonato e fases

A Copa Paraíba possui seis clubes em grupo único, com turno único de cinco rodadas. Ao término da primeira fase, os quatro melhores avançam às semifinais em partida única, com cruzamentos 1º x 4º e 2º x 3º. A final é disputada em ida e volta, com o clube de melhor campanha da primeira fase como mandante da segunda partida.

O domínio terá fases explícitas: `primeira-fase`, `semifinais` e `final`. A primeira fase calcula a classificação por pontos, vitórias, saldo de gols e gols marcados. As fases seguintes derivam os participantes da tabela simulada.

## Dados locais

Os clubes são Treze, Serra Branca, Campinense, Nacional de Patos, Atlético-PB e Esporte de Patos. Seus escudos fornecidos pelo usuário serão copiados para `src/assets/teams` e associados a `Team.badgeUrl`.

Os resultados oficiais serão declarados manualmente em `src/data/copaParaiba.ts`. A rodada 1 contém os três resultados fornecidos. Rodadas 2 a 5 começam como futuras, com data, horário, estádio e mandante conforme a tabela oficial.

Para registrar uma nova rodada real, basta preencher `homeScore`, `awayScore` e trocar o status para `finished` nas partidas correspondentes. A UI usa o status como única fonte de verdade: jogos concluídos entram na tabela oficial e ficam bloqueados no simulador; apenas jogos futuros são editáveis.

## Experiência

A home destaca a Copa Paraíba 2026, classificação vigente e próximos jogos. A página `/campeonatos/copa-paraiba-2026` reúne as abas Classificação, Rodadas, Fases e Simulador.

O simulador recalcula a classificação da primeira fase com os palpites. Ao existirem os quatro classificados, exibe as semifinais previstas com as posições que as originaram. O usuário registra placares das semifinais e, em seguida, vê a final de ida e volta. Empate no agregado permite informar pênaltis para definir o classificado.

## Arquitetura e ocultação do Brasileirão

`src/data/copaParaiba.ts` é o dado ativo da aplicação. Os serviços retornam Copa Paraíba como catálogo e a usam nas consultas locais. A base e os serviços do Brasileirão permanecem no projeto, mas não são listados na home nem vinculados às rotas de navegação. Quando uma API estiver disponível, `VITE_API_URL` continuará sendo o mecanismo de troca de fonte.

Os componentes existentes serão generalizados para receber o campeonato, suas partidas e fases. Um componente de chaveamento apresentará as semifinais e final derivadas da tabela, sem misturar o estado de palpites com dados oficiais.

## Testes

Os testes cobrirão a tabela oficial após a primeira rodada, a exclusão de partidas finalizadas do simulador, os cruzamentos 1º x 4º e 2º x 3º, a definição do mando da final e a promoção de vencedores de mata-mata.

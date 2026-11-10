# FCPB

Aplicação local para acompanhar e simular a Copa Paraíba 2026.

```bash
npm install
npm run dev
npm test
npm run build
```

Sem `VITE_API_URL`, o projeto usa os dados manuais em `src/data/copaParaiba.ts`. Ao configurar essa variável, `src/services/api.ts` passa a buscar a futura API Laravel em `/api`.

## Atualizar uma rodada oficial

Abra `src/data/copaParaiba.ts`, encontre a partida e substitua os dois `null` do placar pelos gols reais. Como exemplo, uma vitória do Treze por 2 a 1 deve ficar assim:

```ts
['atletico-pb', 'treze', 1, 2, '2026-11-11T20:00:00-03:00', 'Almeidão']
```

O status passa automaticamente para `finished`; a partida entra na classificação oficial e deixa de aparecer como editável no simulador. Os outros jogos futuros continuam liberados para palpites.

Rotas atuais: `/` e `/campeonatos/copa-paraiba-2026`.

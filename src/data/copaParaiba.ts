import trezeCrest from "../assets/teams/treze.webp";
import serraBrancaCrest from "../assets/teams/serra-branca.png";
import campinenseCrest from "../assets/teams/campinense.png";
import nacionalCrest from "../assets/teams/nacional-patos.png";
import atleticoCrest from "../assets/teams/atletico-pb.png";
import esporteCrest from "../assets/teams/esporte-patos.png";
import type { Championship, Match, Team } from "../types";

export const copaTeams: Team[] = [
  {
    id: "treze",
    name: "Treze",
    shortName: "TRE",
    color: "#1d1d1d",
    badgeUrl: trezeCrest,
  },
  {
    id: "serra-branca",
    name: "Serra Branca",
    shortName: "SBR",
    color: "#168447",
    badgeUrl: serraBrancaCrest,
  },
  {
    id: "campinense",
    name: "Campinense",
    shortName: "CAM",
    color: "#df1620",
    badgeUrl: campinenseCrest,
  },
  {
    id: "nacional-patos",
    name: "Nacional de Patos",
    shortName: "NAC",
    color: "#057052",
    badgeUrl: nacionalCrest,
  },
  {
    id: "atletico-pb",
    name: "Atlético-PB",
    shortName: "ATP",
    color: "#302d85",
    badgeUrl: atleticoCrest,
  },
  {
    id: "esporte-patos",
    name: "Esporte-PB",
    shortName: "ESP",
    color: "#b64242",
    badgeUrl: esporteCrest,
  },
];

export const copaParaiba: Championship = {
  id: "copa-paraiba-2026",
  slug: "copa-paraiba-2026",
  name: "Copa Paraíba",
  season: "2026",
  currentRound: 1,
  format: "1ª fase · 6 clubes · semifinal e final",
  phaseId: "primeira-fase",
  tiebreakers: ["points", "wins", "goalDifference", "goalsFor", "headToHead"],
};

type Fixture = [string, string, number | null, number | null, string, string];
const fixtures: Fixture[][] = [
  [
    ["treze", "esporte-patos", 2, 1, "2026-11-07T16:00:00-03:00", "Amigão"],
    [
      "serra-branca",
      "atletico-pb",
      4,
      0,
      "2026-11-08T16:00:00-03:00",
      "Amigão",
    ],
    [
      "nacional-patos",
      "campinense",
      0,
      1,
      "2026-11-08T17:00:00-03:00",
      "José Cavalcanti",
    ],
  ],
  [
    [
      "atletico-pb",
      "treze",
      null,
      null,
      "2026-11-11T20:00:00-03:00",
      "Almeidão",
    ],
    [
      "esporte-patos",
      "nacional-patos",
      null,
      null,
      "2026-11-11T20:00:00-03:00",
      "José Cavalcanti",
    ],
    [
      "serra-branca",
      "campinense",
      null,
      null,
      "2026-11-11T20:00:00-03:00",
      "Amigão",
    ],
  ],
  [
    [
      "serra-branca",
      "nacional-patos",
      null,
      null,
      "2026-11-14T16:00:00-03:00",
      "Amigão",
    ],
    ["campinense", "treze", null, null, "2026-11-15T16:00:00-03:00", "Amigão"],
    [
      "esporte-patos",
      "atletico-pb",
      null,
      null,
      "2026-11-15T17:00:00-03:00",
      "José Cavalcanti",
    ],
  ],
  [
    [
      "campinense",
      "esporte-patos",
      null,
      null,
      "2026-11-18T20:00:00-03:00",
      "Amigão",
    ],
    [
      "nacional-patos",
      "atletico-pb",
      null,
      null,
      "2026-11-18T20:00:00-03:00",
      "José Cavalcanti",
    ],
    [
      "treze",
      "serra-branca",
      null,
      null,
      "2026-11-19T20:00:00-03:00",
      "Amigão",
    ],
  ],
  [
    [
      "atletico-pb",
      "campinense",
      null,
      null,
      "2026-11-22T17:00:00-03:00",
      "Perpetão",
    ],
    [
      "treze",
      "nacional-patos",
      null,
      null,
      "2026-11-22T17:00:00-03:00",
      "Amigão",
    ],
    [
      "esporte-patos",
      "serra-branca",
      null,
      null,
      "2026-11-22T17:00:00-03:00",
      "José Cavalcanti",
    ],
  ],
];

export const copaMatches: Match[] = fixtures.flatMap((round, roundIndex) =>
  round.map(
    (
      [homeTeamId, awayTeamId, homeScore, awayScore, date, venue],
      matchIndex,
    ) => ({
      id: `copa-r${roundIndex + 1}-${matchIndex + 1}`,
      championshipId: copaParaiba.id,
      phaseId: "primeira-fase",
      round: roundIndex + 1,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status: homeScore === null ? "scheduled" : "finished",
      date,
      venue,
    }),
  ),
);

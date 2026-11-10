import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { copaTeams } from '../../data/copaParaiba'
import type { StandingRow } from '../../types'
import { StandingsTable } from './StandingsTable'

describe('StandingsTable', () => {
  it('renders a compact mobile table without relying on the wide table', () => {
    const rows: StandingRow[] = copaTeams.map((team, index) => ({ teamId: team.id, position: index + 1, points: 10 - index, played: 5, wins: 3, draws: 1, losses: 1, goalsFor: 8, goalsAgainst: 4, goalDifference: 4, form: [] }))
    const html = renderToStaticMarkup(<StandingsTable rows={rows} teams={copaTeams}/>)

    expect(html).toContain('table-fixed')
    expect(html).not.toContain('>Gol<')
  })
})

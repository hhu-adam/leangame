import { atomWithQuery } from 'jotai-tanstack-query'

import type { ApiGameInfo, ApiGameInstanceCount, ApiServerLoad } from '../api'
import { fetchJson } from '../utils/fetch'

/** The featured games, and the local games in development */
export const featuredGamesAtom = atomWithQuery(() => ({
  queryKey: ['games'],
  queryFn: () => fetchJson<ApiGameInfo[]>('/api/games'),
}))

/** The server load, updated every 15 seconds */
export const serverLoadAtom = atomWithQuery(() => ({
  queryKey: ['load'],
  queryFn: () => fetchJson<ApiServerLoad>('/api/load'),
  refetchInterval: 15_000,
}))

/** The number of players, i.e. running Lean instances of all games, updated every 15 seconds */
export const activePlayersAtom = atomWithQuery(() => ({
  queryKey: ['activePlayers'],
  queryFn: () => fetchJson<ApiGameInstanceCount[]>('/api/lean/instances/count'),
  select: (counts: ApiGameInstanceCount[]) =>
    counts.reduce((sum, { count }) => sum + count, 0),
  refetchInterval: 15_000,
}))

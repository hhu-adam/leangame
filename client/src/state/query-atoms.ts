import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { atomWithQuery } from 'jotai-tanstack-query'

import type { ApiGameData, ApiLevelData } from '../api'
import { fetchJson, gameDataUrl } from '../utils/fetch'
import { gameIdAtom, levelIdAtom, worldIdAtom } from './location-atoms'

/** The info about all games */
export const gameInfoAtomFamily = atomFamily((gameId: string) =>
  atomWithQuery<ApiGameData>(() => ({
    queryKey: ['gameInfo', gameId],
    queryFn: () => fetchJson<ApiGameData>(gameDataUrl(gameId, 'game')),
    enabled: gameId.length > 0,
  })),
)

/** The info about the current game */
export const gameInfoAtom = atom(get => {
  const gameId = get(gameIdAtom)
  return get(gameInfoAtomFamily(gameId ?? ''))
})

/** Info about the current level */
export const levelInfoAtom = atomWithQuery<ApiLevelData>(get => {
  const gameId = get(gameIdAtom)
  const worldId = get(worldIdAtom)
  const levelId = get(levelIdAtom)
  return {
    queryKey: ['levelInfo', gameId, worldId, levelId],
    queryFn: () =>
      fetchJson<ApiLevelData>(
        gameDataUrl(
          gameId!,
          `level/${encodeURIComponent(worldId!)}/${levelId}`,
        ),
      ),
    enabled:
      gameId !== undefined && worldId !== undefined && levelId !== undefined,
  }
})

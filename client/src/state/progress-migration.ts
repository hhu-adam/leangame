import type {
  GameProgress,
  LevelProgress,
  Progress,
  WorldProgress,
} from './progress-types'

/*
The old client stored the progress under the game as written in the URL, e.g.
`g/leanprover-community/NNG4`. Now game IDs are lowercase, so the progress is moved to
the lowercase key. Entries of the same game in different spellings are merged.
*/

/** `a` with what `b` has in addition, e.g. levels only completed in `b` */
function mergeGameProgress(a: GameProgress, b: GameProgress): GameProgress {
  const data: GameProgress['data'] = { ...a.data }
  for (const [world, worldB] of Object.entries(b.data)) {
    const worldA = data[world] as WorldProgress | undefined
    if (!worldA) {
      data[world] = worldB
      continue
    }
    const merged: WorldProgress = {
      ...worldA,
      readIntro: worldA.readIntro || worldB.readIntro,
    }
    for (const [key, levelB] of Object.entries(worldB)) {
      if (key === 'readIntro') continue
      const level = Number(key)
      const levelA = merged[level] as LevelProgress | undefined
      if (!levelA || (!levelA.completed && (levelB as LevelProgress).completed))
        merged[level] = levelB as LevelProgress
    }
    data[world] = merged
  }
  return {
    ...b,
    ...a,
    inventory: [...new Set([...a.inventory, ...b.inventory])],
    readIntro: a.readIntro || b.readIntro,
    data,
  }
}

/** `progress` with all games under their lowercase ID, `undefined` if nothing changed */
export function migrateProgress(progress: Progress): Progress | undefined {
  const keys = Object.keys(progress.games)
  if (keys.every(key => key === key.toLowerCase())) return undefined
  // the lowercase keys first, so that their settings, e.g. the difficulty, are kept
  keys.sort(
    (k1, k2) =>
      Number(k2 === k2.toLowerCase()) - Number(k1 === k1.toLowerCase()),
  )
  const games: Progress['games'] = {}
  for (const key of keys) {
    const id = key.toLowerCase()
    const game = progress.games[key]
    games[id] = id in games ? mergeGameProgress(games[id], game) : game
  }
  return { ...progress, games }
}

/** Migrates the progress in local storage under `key`, see `migrateProgress` */
export function migrateStoredProgress(key: string) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return
    const migrated = migrateProgress(JSON.parse(stored) as Progress)
    if (migrated) localStorage.setItem(key, JSON.stringify(migrated))
  } catch (error) {
    // e.g. local storage is not available, or holds something else
    console.warn('Could not migrate the progress', error)
  }
}

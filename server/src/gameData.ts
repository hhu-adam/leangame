import { existsSync } from 'node:fs'
import path from 'node:path'
import type { Response } from 'express'
import { safeJoin } from './utils/path.js'
import { isDevMode } from './utils/devMode.js'

const TEST_GAME_PATH = path.resolve(import.meta.dirname, '..', 'TestGame')
const REPO_PARENT_DIR = path.resolve(import.meta.dirname, '..', '..', '..')

const GAMES_DIR = path.resolve(
  import.meta.dirname,
  '..',
  process.env.GAMES_DIR ?? 'games',
)

/** returns the path to the game or writes a 404 if the game has not been found */
export function requireGame(owner: string, game: string, res: Response) {
  if (game.toLowerCase() === 'testgame') {
    return TEST_GAME_PATH
  }

  if (owner.toLowerCase() === 'local') {
    if (isDevMode()) {
      const localPath = safeJoin(REPO_PARENT_DIR, game)
      if (localPath && existsSync(localPath)) return localPath
    }
    res.status(404).json({ error: 'Game not found' })
    return undefined
  }

  const gamePath = safeJoin(GAMES_DIR, owner.toLowerCase(), game.toLowerCase())
  if (gamePath && existsSync(gamePath)) return gamePath

  res.status(404).json({ error: 'Game not found' })
  return undefined
}

export function gameDataFilePath(gamePath: string, filename: string) {
  return safeJoin(gamePath, '.lake', 'gamedata', filename)
}

export function i18nFilePath(gamePath: string, lang: string) {
  return safeJoin(gamePath, '.i18n', lang, 'Game.json')
}

import path from 'node:path'
import type { Response } from 'express'
import { safeJoin } from './utils/path.js'

export const TEST_GAME_PATH = path.resolve(import.meta.dirname, '../TestGame')

/** returns the path to the game or throws a 404 if the game has not been found */
export function requireGame(owner: string, game: string, res: Response) {
  // TODO: support other games
  const gamePath =
    game.toLowerCase() === 'testgame' ? TEST_GAME_PATH : undefined
  if (!gamePath) {
    res.status(404).json({ error: 'Game not found' })
    return undefined
  }
  return gamePath
}

export function gameDataFilePath(gamePath: string, filename: string) {
  return safeJoin(gamePath, '.lake', 'gamedata', filename)
}

export function i18nFilePath(gamePath: string, lang: string) {
  return safeJoin(gamePath, '.i18n', lang, 'Game.json')
}

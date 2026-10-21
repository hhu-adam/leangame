import { getImportStats } from './database/db.js'
import type { ApiGameImportStats } from './api.js'
import { importedGames } from './import/imported.js'
import path from 'path'
import fs from 'node:fs/promises'

/**
 * The import statistics of all imported games, featured or not, including games which
 * are not (fully) built.
 */
export async function listImportStats(): Promise<ApiGameImportStats[]> {
  const stats = getImportStats()
  const result: ApiGameImportStats[] = []
  for (const { owner, repo, gamePath } of await importedGames()) {
    const toolchain = await readToolchain(gamePath)
    const history = stats.get(`${owner}/${repo}`)
    result.push({
      owner,
      repo,
      toolchain,
      leanVersion: toolchain?.split(':')[1] ?? null,
      firstImportedAt: history?.firstImportedAt ?? null,
      lastImportedAt: history?.lastImportedAt ?? null,
      importCount: history?.importCount ?? 0,
      importsPerDay: history?.importsPerDay ?? {},
      fullyBuilt: history?.fullyBuilt ?? null,
    })
  }
  return result
}

async function readToolchain(gamePath: string): Promise<string | null> {
  return fs
    .readFile(path.join(gamePath, 'lean-toolchain'), 'utf-8')
    .then((content) => content.trim())
    .catch(() => null)
}

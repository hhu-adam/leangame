import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import {
  DbGameImportPerDayRow,
  DbGameImportPerGameRow,
  DbImportStats,
  DbInsertGameImport,
} from './models.js'
import { migrate } from './migration.js'

/**
 * We use a SQLite database which is a single file, `leangame.db`. The motivation is its
 * simplicity as it is already shipped with node.
 *
 * At startup, an existing database is migrated using `migrate()`.
 * To clear the database, simply delete the file while the server is stopped.
 */

const DATABASE_PATH = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  process.env.DATABASE_PATH ?? path.join('data', 'leangame.db'),
)

function openDatabase(): DatabaseSync {
  mkdirSync(path.dirname(DATABASE_PATH), { recursive: true })
  const db = new DatabaseSync(DATABASE_PATH)
  migrate(db)
  return db
}

const db = openDatabase()

/** Records a successful import */
export function addImport(record: DbInsertGameImport): void {
  db.prepare(
    `INSERT INTO game_imports (owner, repo, imported_at, artifact_id, toolchain, fully_built)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    record.owner.toLowerCase(),
    record.repo.toLowerCase(),
    new Date().toISOString(),
    record.artifactId,
    record.toolchain,
    record.fullyBuilt ? 1 : 0,
  )
}

/**
 * Import statistics, aggregated per game.
 *
 * Aggregates the import statistic over all games and days where something has been
 * imported.
 */
export function getImportStats(): Map<string, DbImportStats> {
  const games: DbGameImportPerGameRow[] = db
    .prepare(
      `SELECT owner, repo, MIN(imported_at) AS first, MAX(imported_at) AS last,
         COUNT(*) AS count,
         (SELECT fully_built FROM game_imports AS latest
          WHERE latest.owner = g.owner AND latest.repo = g.repo
          ORDER BY imported_at DESC LIMIT 1) AS fullyBuilt
       FROM game_imports AS g GROUP BY owner, repo`,
    )
    .all() as unknown as DbGameImportPerGameRow[]
  const days: DbGameImportPerDayRow[] = db
    .prepare(
      `SELECT owner, repo, substr(imported_at, 1, 10) AS day, COUNT(*) AS count
       FROM game_imports GROUP BY owner, repo, day ORDER BY day`,
    )
    .all() as unknown as DbGameImportPerDayRow[]

  const stats = new Map<string, DbImportStats>()
  for (const game of games) {
    stats.set(`${game.owner}/${game.repo}`, {
      firstImportedAt: game.first,
      lastImportedAt: game.last,
      importCount: game.count,
      importsPerDay: {},
      fullyBuilt: game.fullyBuilt === 1,
    })
  }
  for (const { owner, repo, day, count } of days) {
    stats.get(`${owner}/${repo}`)!.importsPerDay[day] = count
  }
  return stats
}

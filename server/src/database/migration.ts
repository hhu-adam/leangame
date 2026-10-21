import { DatabaseSync } from 'node:sqlite'

/**
 * The database versions.
 *
 * To migrate, a new entry can be added to this list.
 * Existing entries *must not* be edited anymore.
 */
const MIGRATIONS = [
  `CREATE TABLE game_imports (
    id          INTEGER PRIMARY KEY,
    owner       TEXT NOT NULL,     -- lower case
    repo        TEXT NOT NULL,     -- lower case
    imported_at TEXT NOT NULL,     -- ISO 8601, UTC
    artifact_id INTEGER NOT NULL,
    toolchain   TEXT NOT NULL,
    fully_built INTEGER NOT NULL   -- 0 or 1
  );
  CREATE INDEX game_imports_game ON game_imports (owner, repo, imported_at);`,
]

/**
 * Migrates the database to the latest version, using the SQLite `user_version`.
 *
 * On failure, this throws and leaves the database in unmigrated state.
 */
export function migrate(db: DatabaseSync) {
  const { user_version: version } = db.prepare('PRAGMA user_version').get() as {
    user_version: number
  }
  for (let i = version; i < MIGRATIONS.length; i++) {
    // SQLite schema changes are transactional, so a failing migration changes nothing
    db.exec('BEGIN')
    try {
      db.exec(MIGRATIONS[i])
      db.exec(`PRAGMA user_version = ${i + 1}`)
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  }
}

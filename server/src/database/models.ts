export interface DbInsertGameImport {
  owner: string
  repo: string
  artifactId: number
  toolchain: string
  fullyBuilt: boolean
}

/** A row of the per-game query in `getImportStats` */
export interface DbGameImportPerGameRow {
  owner: string
  repo: string
  first: string
  last: string
  count: number
  /** 0 or 1 */
  fullyBuilt: number
}

/** A row of the per-day query in `getImportStats` */
export interface DbGameImportPerDayRow {
  owner: string
  repo: string
  /** e.g. `"2026-10-18"` */
  day: string
  count: number
}

export interface DbImportStats {
  firstImportedAt: string
  lastImportedAt: string
  importCount: number
  /** e.g. `"2026-10-18"` → 2 */
  importsPerDay: Record<string, number>
  /** build state of the last import */
  fullyBuilt: boolean
}

import type { ChildProcessWithoutNullStreams } from 'child_process'
import type { LspClient } from './lean/lspClient.js'

/** API input to validate a proof */
export interface ApiProofCheckInput {
  world: string
  level: number
  difficulty: number
  inventory: string[]
  tactics: string[]
  /** include hover information for goals and hypotheses */
  hovers?: boolean
  /** the player's language, e.g. `de`, for the anonymous play statistics */
  language?: string
}

/** API result of a proof validation */
export interface ApiProofCheckResult {
  /** the initial state followed by one step per tactic */
  steps: ApiProofStep[]
  /** completed without error or warning */
  completed: boolean
  /** no errors, but warnings present */
  completedWithWarnings: boolean
  hovers: ApiHover[]
  /** Lean docstrings referenced by `hovers` */
  hoverDocs: string[]
}

export type ApiCode =
  | { text: string }
  | { append: ApiCode[] }
  | { tag: [number, ApiCode] }

export interface ApiHover {
  /** type of the subexpression */
  type?: string
  /** the subexpression with implicit arguments */
  expr?: string
  /** index in `hoverDocs` */
  doc?: number
}

export interface ApiProofStep {
  /** the tactic of this step, empty for the initial state */
  tactic: string
  /** the goals after this step */
  goals: ApiGoal[]
  diagnostics: ApiDiagnostic[]
}

export interface ApiGoal {
  userName?: string
  hyps: ApiHypothesis[]
  type: string
  hints: ApiHint[]
  /** `type` with hover information */
  typeWithHover?: ApiCode
}

export interface ApiHypothesis {
  names: string[]
  type: string
  /** value of a `let` variable */
  value?: string
  /** the hypothesis is of type `Prop` */
  isAssumption: boolean
  /** `type` with hover information */
  typeWithHover?: ApiCode
  /** `value` with hover information */
  valueWithHover?: ApiCode
}

export interface ApiHint {
  text: string
  hidden: boolean
  rawText: string
  varNames: [string, string][]
}

export interface ApiDiagnostic {
  /** 1: error, 2: warning, 3: information, 4: hint */
  severity: number
  message: string
  /** 0-based line relative to the first tactic */
  line: number
  character: number
}

export interface LeanInstance {
  id: string
  gamePath: string
  /** where the `gamePath` is mounted inside the bubblewrap containter. */
  gamePathBwrap: string
  process: ChildProcessWithoutNullStreams
  status: LeanInstanceStatus
  startedAt: Date
  exitCode: number | null
  client: LspClient
  /** resolves once the LSP `initialize`/`initialized` handshake has completed */
  lspReady: Promise<void>
  /** the game as requested by the player, lower case, for the play statistics */
  game: { owner: string; repo: string }
  /** time of the last check in ms, for the play statistics. Never stored. */
  lastCheckAt?: number
}

export type LeanInstanceStatus = 'starting' | 'running' | 'exited'

/** A game to be displayed on the landing page */
export interface ApiGameInfo {
  owner: string
  repo: string
  /** listed in the `featuredGames` of the server config */
  featured: boolean
  /** `tile` and `settings` of the game's `game.json` */
  tile: unknown
  settings: unknown
}

/** Statistic about a game's import history */
export interface ApiGameImportStats {
  owner: string
  repo: string
  /** from `lean-toolchain`, e.g. `leanprover/lean4:v4.23.0` */
  toolchain: string | null
  /** e.g. `v4.23.0` */
  leanVersion: string | null
  /** `null` for games imported before the import history was recorded */
  firstImportedAt: string | null
  lastImportedAt: string | null
  importCount: number
  /** e.g. `"2026-10-18"` → 2 */
  importsPerDay: Record<string, number>
  /** whether the last import was fully built */
  fullyBuilt: boolean | null
}

/** Number of Lean instances of a game which have not exited */
export interface ApiGameInstanceCount {
  owner: string
  repo: string
  count: number
}

/** Anonymous play statistics of a game in one 30-minute interval */
export interface ApiGameActivityStats {
  /** start of the interval, UTC, e.g. `"2026-10-22T14:30Z"` */
  interval: string
  owner: string
  repo: string
  /** the language the game is played in, e.g. `de`, or `unknown` */
  language: string
  /** first language of the browser's `Accept-Language`, e.g. `fr`, or `unknown` */
  preferredLanguage: string
  /** players whose first check fell into this interval */
  sessions: number
  checks: number
  /** active play time, without breaks */
  playSeconds: number
}

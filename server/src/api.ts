import type { ChildProcessWithoutNullStreams } from 'child_process'
import type { LspClient } from './lean/lspClient.js'

/** API input to validate a proof */
export interface ApiProofCheckInput {
  world: string
  level: number
  difficulty: number
  inventory: string[]
  tactics: string[]
}

/** API result of a proof validation */
export interface ApiProofCheckResult {
  /** the initial state followed by one step per tactic */
  steps: ApiProofStep[]
  /** completed without error or warning */
  completed: boolean
  /** no errors, but warnings present */
  completedWithWarnings: boolean
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
}

export interface ApiHypothesis {
  names: string[]
  type: string
  /** value of a `let` variable */
  value?: string
  /** the hypothesis is of type `Prop` */
  isAssumption: boolean
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
}

export type LeanInstanceStatus = 'starting' | 'running' | 'exited'

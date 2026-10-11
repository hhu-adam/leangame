import type { ChildProcessWithoutNullStreams } from 'child_process'
import type { LspClient } from './lean/lspClient.js'

/** API input to validate a proof */
export interface ApiProofCheck {
  world: string
  level: number
  difficulty: number
  inventory: string[]
  tactics: string[]
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
  /** latest diagnostics per open document uri, fed by `textDocument/publishDiagnostics` */
  diagnostics: Map<string, Diagnostic[]>
}

export interface Diagnostic {
  range: unknown
  severity?: number
  message: string
}

export type LeanInstanceStatus = 'starting' | 'running' | 'exited'

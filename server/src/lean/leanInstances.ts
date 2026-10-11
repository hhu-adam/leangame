import { randomUUID } from 'node:crypto'
import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { createLspClient } from './lspClient.js'
import type { Diagnostic, LeanInstance } from '../api.js'
import path from 'node:path'

const instances = new Map<string, LeanInstance>()

const isDevelopment = process.env.NODE_ENV === 'development'
const noBwrap = process.env.NO_BWRAP == 'true' || isDevelopment

export function startInstance(
  gamePath: string,
  /** The TestGame doesn't have its own copy of the server and needs leangame as a local dependency */
  includeServerCopy?: boolean,
): LeanInstance {
  let child: ChildProcessWithoutNullStreams
  if (noBwrap) {
    child = spawn('lake', ['serve', '--'], { cwd: gamePath })
  } else {
    let options = [gamePath]

    if (includeServerCopy) {
      const lean4GameFolder = path.join(import.meta.dirname, '..', '..', 'lean')
      options.push('--ro-bind', lean4GameFolder, '/lean')
    }

    child = spawn(
      path.join(import.meta.dirname, '..', 'scripts', 'bubblewrap.sh'),
      options,
    )
  }

  const client = createLspClient(child)
  const diagnostics = new Map<string, Diagnostic[]>()
  client.onNotification(
    'textDocument/publishDiagnostics',
    (params: { uri: string; diagnostics: Diagnostic[] }) => {
      diagnostics.set(params.uri, params.diagnostics)
    },
  )

  const handshake = client
    .request('initialize', {
      processId: process.pid,
      rootUri: null,
      capabilities: {},
    })
    .then(() => client.notify('initialized', {}))
    .then(() => undefined)
  // the `initialize` request never settles if the process dies, so fail explicitly
  const exited = new Promise<never>((_, reject) =>
    child.once('exit', (code) =>
      reject(new Error(`Lean server exited with code ${code}`)),
    ),
  )
  const lspReady = Promise.race([handshake, exited])
  // the real error surfaces to whoever awaits `lspReady`; this just stops
  // Node from complaining about an unhandled rejection in the meantime
  lspReady.catch(() => {})

  const instance: LeanInstance = {
    id: randomUUID(),
    gamePath,
    gamePathBwrap: noBwrap ? gamePath : '/game',
    process: child,
    status: 'starting',
    startedAt: new Date(),
    exitCode: null,
    client,
    lspReady,
    diagnostics,
  }

  child.stderr?.on('data', (chunk: Buffer) => {
    console.error(`[lean:${instance.id}] ${chunk.toString()}`)
  })

  child.once('spawn', () => {
    instance.status = 'running'
  })

  child.once('exit', (code) => {
    instance.status = 'exited'
    instance.exitCode = code
  })

  child.once('error', (err) => {
    instance.status = 'exited'
    console.error(`[lean:${instance.id}] failed to start:`, err)
  })

  instances.set(instance.id, instance)
  return instance
}

export function getInstance(id: string): LeanInstance | undefined {
  return instances.get(id)
}

// TODO: this is for debugging only. We should remove it eventually
export function getAllInstances(): LeanInstance[] {
  return Array.from(instances.values())
}

export function stopInstance(id: string): boolean {
  const instance = instances.get(id)
  if (!instance) return false

  if (instance.status !== 'exited') {
    instance.process.kill('SIGTERM')
  }
  return true
}

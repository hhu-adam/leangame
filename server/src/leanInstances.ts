import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { createLspClient } from './lean/lspClient.js'
import type { Diagnostic, LeanInstance } from './api.js'

const instances = new Map<string, LeanInstance>()

export function startInstance(gamePath: string): LeanInstance {
  const child = spawn('lake', ['serve', '--'], { cwd: gamePath })

  const client = createLspClient(child)
  const diagnostics = new Map<string, Diagnostic[]>()
  client.onNotification(
    'textDocument/publishDiagnostics',
    (params: { uri: string; diagnostics: Diagnostic[] }) => {
      diagnostics.set(params.uri, params.diagnostics)
    },
  )

  const lspReady = client
    .request('initialize', {
      processId: process.pid,
      rootUri: null,
      capabilities: {},
    })
    .then(() => client.notify('initialized', {}))
    .then(() => undefined)
  // the real error surfaces to whoever awaits `lspReady`; this just stops
  // Node from complaining about an unhandled rejection in the meantime
  lspReady.catch(() => {})

  const instance: LeanInstance = {
    id: randomUUID(),
    gamePath,
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

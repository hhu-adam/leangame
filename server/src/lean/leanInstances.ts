import { randomUUID } from 'node:crypto'
import { createLspClient } from './lspClient.js'
import type { LeanInstance } from '../api.js'
import { forgetInstanceDocs } from './openDocuments.js'
import { noBwrap, spawnGame } from './sandbox.js'

const instances = new Map<string, LeanInstance>()

export function startInstance(
  gamePath: string,
  /** the game as requested by the player, lower case, for the play statistics */
  game: { owner: string; repo: string },
  /** The TestGame doesn't have its own copy of the server and needs leangame as a local dependency */
  includeServerCopy?: boolean,
): LeanInstance {
  const child = spawnGame(gamePath, ['lake', 'serve', '--'], includeServerCopy)

  const client = createLspClient(child)

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
    game,
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
    forgetInstanceDocs(instance.id)
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

/** Stops all running instances of a game, returns how many were stopped */
export function stopGameInstances(gamePath: string): number {
  let stopped = 0
  for (const instance of instances.values()) {
    if (instance.gamePath === gamePath && instance.status !== 'exited') {
      instance.process.kill('SIGTERM')
      stopped++
    }
  }
  return stopped
}

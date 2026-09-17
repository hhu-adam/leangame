import { randomUUID } from 'node:crypto'
import { spawn, type ChildProcess } from 'node:child_process'

export type LeanInstanceStatus = 'starting' | 'running' | 'exited'

export interface LeanInstance {
  id: string
  gamePath: string
  process: ChildProcess
  status: LeanInstanceStatus
  startedAt: Date
  exitCode: number | null
}

const instances = new Map<string, LeanInstance>()

export function startInstance(gamePath: string): LeanInstance {
  const child = spawn('lake', ['serve', '--'], { cwd: gamePath })

  const instance: LeanInstance = {
    id: randomUUID(),
    gamePath,
    process: child,
    status: 'starting',
    startedAt: new Date(),
    exitCode: null,
  }

  // `lake serve` speaks LSP over stdio. We don't parse it yet, but we must
  // keep draining the pipes so the child never blocks on a full OS buffer.
  child.stdout?.on('data', () => {})
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

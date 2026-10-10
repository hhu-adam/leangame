import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { gameDataFilePath } from '../gameData.js'
import { existsSync } from 'node:fs'
import type { ApiProofCheck, LeanInstance } from '../api.js'

interface CheckResult {
  completed: boolean
}

interface ProofCheck extends ApiProofCheck {
  instance: LeanInstance
}

// serialises checks against the same (instance, world, level) so a single
// user's own overlapping requests can't race on the same open document
const queues = new Map<string, Promise<unknown>>()

function withQueue<T>(key: string, task: () => Promise<T>): Promise<T> {
  const prev = queues.get(key) ?? Promise.resolve()
  const next = prev.then(task, task)
  queues.set(
    key,
    next.catch(() => {}),
  )
  return next
}

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content) as T
}

export function checkProof(input: ProofCheck): Promise<CheckResult> {
  const key = `${input.instance.id}:${input.world}:${input.level}`
  return withQueue(key, () => runCheck(input))
}

async function runCheck({
  difficulty,
  instance,
  inventory,
  level,
  tactics,
  world,
}: ProofCheck): Promise<CheckResult> {
  await instance.lspReady

  const levelDataPath = gameDataFilePath(
    instance.gamePath,
    `level__${world}__${level}.json`,
  )
  const gameDataPath = gameDataFilePath(instance.gamePath, 'game.json')

  if (!levelDataPath || !gameDataPath) {
    throw new Error('Could not resolve level/game data paths')
  }
  if (!existsSync(levelDataPath)) {
    throw new Error(`Could not find world '${world}', level '${level}'.`)
  }
  if (!existsSync(gameDataPath)) {
    throw new Error(`Could not find the requested game.`)
  }
  const levelData = await readJson<{ module: string }>(levelDataPath)
  const gameData = await readJson<{ name: string }>(gameDataPath)

  const modulePath = levelData.module.split('.').join(path.sep) + '.lean'
  const sourcePath = path.join(instance.gamePath, modulePath)
  const originalContent = await fs.readFile(sourcePath, 'utf-8')

  const tacticBlock = tactics.map((tactic) => '  ' + tactic).join('\n')
  const inventoryFormatted = '[' + inventory.join('\n') + ']'
  const content =
    'import GameServer\n' +
    `${originalContent}\n\n` +
    `Runner "${gameData.name}" "${world}" ${level} ` +
    `(difficulty := ${difficulty}) ` +
    `(inventory := ${inventoryFormatted}) ` +
    `:= by\n${tacticBlock}\n`

  const uri = pathToFileURL(sourcePath).toString()
  const version = 1

  await instance.client.notify('textDocument/didOpen', {
    textDocument: { uri, languageId: 'lean4', version, text: content },
  })

  try {
    await instance.client.request('textDocument/waitForDiagnostics', {
      uri,
      version,
    })

    const diagnostics = instance.diagnostics.get(uri) ?? []
    // `sorry` only produces a warning (severity 2), not an error, but it must
    // never count as a completed proof
    const completed = !diagnostics.some(
      (d) => d.severity === 1 || d.message.includes('sorry'),
    )
    return { completed }
  } finally {
    await instance.client.notify('textDocument/didClose', {
      textDocument: { uri },
    })
    instance.diagnostics.delete(uri)
  }
}

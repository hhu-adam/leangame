import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { gameDataFilePath } from '../gameData.js'
import { existsSync } from 'node:fs'
import type {
  ApiProofCheckInput,
  ApiProofCheckResult,
  LeanInstance,
} from '../api.js'
import { closeDoc, syncDoc, withQueue } from './openDocuments.js'

/** Extend the API-input with the Lean instance */
interface ProofCheck extends ApiProofCheckInput {
  instance: LeanInstance
}

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content) as T
}

export function checkProof(input: ProofCheck): Promise<ApiProofCheckResult> {
  return withQueue(input.instance.id, () => checkProofAux(input))
}

async function checkProofAux({
  difficulty,
  hovers = false,
  instance,
  inventory,
  level,
  tactics,
  world,
}: ProofCheck): Promise<ApiProofCheckResult> {
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
  const header =
    'import GameServer\n' +
    `${originalContent}\n\n` +
    `Runner "${gameData.name}" "${world}" ${level} ` +
    `(difficulty := ${difficulty}) ` +
    `(inventory := ${inventoryFormatted}) ` +
    `:= by\n`
  const content = `${header}${tacticBlock}\n`
  // 0-based line of the first tactic
  const proofStartLine = header.split('\n').length - 1

  const uri = pathToFileURL(
    path.posix.join(instance.gamePathBwrap, modulePath),
  ).toString()

  try {
    const { version } = await syncDoc(instance, uri, content)
    await instance.client.request('textDocument/waitForDiagnostics', {
      uri,
      version,
    })

    const position = { line: proofStartLine, character: 0 }
    const { sessionId } = await instance.client.request<{
      sessionId: number | string
    }>('$/lean/rpc/connect', { uri })
    return await instance.client.request<ApiProofCheckResult>(
      '$/lean/rpc/call',
      {
        textDocument: { uri },
        position,
        sessionId,
        method: 'Game.checkProof',
        params: {
          gameId: gameData.name,
          worldId: world,
          levelId: level,
          proofStartLine,
          hovers: hovers,
        },
      },
    )
  } catch (err) {
    // start over with a fresh file worker on the next check
    await closeDoc(instance, uri)
    throw err
  }
}

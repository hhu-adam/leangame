import express from 'express'
import { gameDataFilePath, i18nFilePath, requireGame } from './gameData.js'
import { checkProof } from './lean/proofCheck.js'
import {
  CheckSupersededError,
  CheckTimeoutError,
} from './lean/openDocuments.js'
import {
  getAllInstances,
  getInstance,
  startInstance,
  stopInstance,
} from './lean/leanInstances.js'
import path from 'path'
import { sendJsonFile } from './utils/response.js'
import { ApiProofCheckInput } from './api.js'

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.json())

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.post('/api/lean/start/:owner/:game', (req, res) => {
  const game = req.params.game
  const owner = req.params.owner
  const gamePath = requireGame(owner, game, res)
  if (!gamePath) return
  try {
    const instance = startInstance(gamePath, game.toLowerCase() === 'testgame')
    res.status(201).json({
      id: instance.id,
      status: instance.status,
      startedAt: instance.startedAt,
    })
  } catch (err) {
    // TODO: do not expose error message, write to logs instead
    res
      .status(500)
      .json({ error: `Failed to start Lean server: ${(err as Error).message}` })
  }
})

// TODO: this is for debugging only. We should remove it eventually
app.get('/api/lean/instances', (req, res) => {
  const instances = getAllInstances()
  res.json(
    instances.map((instance) => ({
      id: instance.id,
      status: instance.status,
      startedAt: instance.startedAt,
      exitCode: instance.exitCode,
    })),
  )
})

app.get('/api/lean/instances/:id', (req, res) => {
  const instance = getInstance(req.params.id)
  if (!instance) {
    res.status(404).json({ error: 'Instance not found' })
    return
  }
  res.json({
    id: instance.id,
    status: instance.status,
    startedAt: instance.startedAt,
    exitCode: instance.exitCode,
  })
})

app.delete('/api/lean/instances/:id', (req, res) => {
  const found = stopInstance(req.params.id)
  if (!found) {
    res.status(404).json({ error: 'Instance not found' })
    return
  }
  const instance = getInstance(req.params.id)!
  res.json({ id: instance.id, status: instance.status })
})

app.post('/api/lean/instances/:id/check', async (req, res) => {
  const input: ApiProofCheckInput = req.body
  // TODO: validate input
  const instance = getInstance(req.params.id)
  if (!instance) {
    res.status(404).json({ error: 'Instance not found' })
    return
  }
  try {
    const result = await checkProof({ ...input, instance })
    res.json(result)
  } catch (err) {
    if (err instanceof CheckSupersededError) {
      res.status(409).json({ error: err.message })
      return
    }
    if (err instanceof CheckTimeoutError) {
      res.status(504).json({ error: err.message })
      return
    }
    // TODO: do not expose error message, write to logs instead
    res
      .status(500)
      .json({ error: `Failed to check proof: ${(err as Error).message}` })
  }
})

app.get('/api/data/:owner/:game/game', (req, res) => {
  const gamePath = requireGame(req.params.owner, req.params.game, res)
  if (!gamePath) return
  sendJsonFile(res, gameDataFilePath(gamePath, 'game.json'))
})

app.get('/api/data/:owner/:game/inventory', (req, res) => {
  const gamePath = requireGame(req.params.owner, req.params.game, res)
  if (!gamePath) return
  sendJsonFile(res, path.join(gamePath, '.lake', 'gamedata', 'inventory.json'))
})

app.get('/api/data/:owner/:game/level/:world/:level', (req, res) => {
  const gamePath = requireGame(req.params.owner, req.params.game, res)
  if (!gamePath) return
  sendJsonFile(
    res,
    gameDataFilePath(
      gamePath,
      `level__${req.params.world}__${req.params.level}.json`,
    ),
  )
})

app.get('/api/data/:owner/:game/doc/:kind/:name', (req, res) => {
  const gamePath = requireGame(req.params.owner, req.params.game, res)
  if (!gamePath) return
  sendJsonFile(
    res,
    gameDataFilePath(
      gamePath,
      `doc__${req.params.kind}__${req.params.name}.json`,
    ),
  )
})

app.get('/api/i18n/:owner/:game/:lang', (req, res) => {
  const gamePath = requireGame(req.params.owner, req.params.game, res)
  if (!gamePath) return
  sendJsonFile(res, i18nFilePath(gamePath, req.params.lang))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

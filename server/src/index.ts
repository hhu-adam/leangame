import express from 'express'
import { gameDataFilePath, i18nFilePath } from './gameData.js'
import { TEST_GAME_PATH, requireGame } from './gameData.js'
import {
  getAllInstances,
  getInstance,
  startInstance,
  stopInstance,
} from './leanInstances.js'
import path from 'path'
import { sendJsonFile } from './utils/response.js'

const PORT = process.env.PORT || 8000
const app = express()

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.post('/api/lean/start/:owner/:game', (_req, res) => {
  try {
    // TODO: use owner and game instead of the testgame
    const instance = startInstance(TEST_GAME_PATH)
    res.status(201).json({
      id: instance.id,
      status: instance.status,
      startedAt: instance.startedAt,
    })
  } catch (err) {
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

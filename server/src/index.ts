import express from 'express'
import {
  gameDataFilePath,
  i18nFilePath,
  isTestGame,
  listGames,
  requireGame,
} from './gameData.js'
import { checkProof } from './lean/proofCheck.js'
import {
  CheckSupersededError,
  CheckTimeoutError,
} from './lean/openDocuments.js'
import {
  countActiveInstances,
  getAllInstances,
  getInstance,
  startInstance,
  stopInstance,
} from './lean/leanInstances.js'
import path from 'path'
import { sendJsonFile } from './utils/response.js'
import {
  getImportStatus,
  isValidRepoName,
  startImport,
} from './import/gameImport.js'
import { ApiProofCheckInput } from './api.js'
import { listGameActivity, listImportStats, recordCheck } from './stats.js'
import { serveClient } from './client.js'
import { getServerLoad } from './serverLoad.js'
import { isDevMode } from './utils/devMode.js'

const PORT = Number(process.env.PORT) || 8000
/** e.g. `127.0.0.1` to only accept connections from a reverse proxy on the same machine */
const HOST = process.env.HOST
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
    const instance = startInstance(
      gamePath,
      { owner: owner.toLowerCase(), repo: game.toLowerCase() },
      isTestGame(owner, game),
    )
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

// must be registered before '/api/lean/instances/:id'
app.get('/api/lean/instances/count', (_req, res) => {
  res.json(countActiveInstances())
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
  recordCheck(instance, input.language, req.acceptsLanguages())
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

app.post('/api/import/:owner/:repo/trigger', (req, res) => {
  const { owner, repo } = req.params
  if (!isValidRepoName(owner, repo)) {
    res.status(400).json({ error: 'Invalid repository name' })
    return
  }
  res.status(202).json(startImport(owner, repo))
})

app.get('/api/import/:owner/:repo', (req, res) => {
  const status = getImportStatus(req.params.owner, req.params.repo)
  if (!status) {
    res.status(404).json({ error: 'No import found' })
    return
  }
  res.json(status)
})

app.get('/api/load', (_req, res) => {
  res.json(getServerLoad())
})

app.get('/api/games', async (_req, res) => {
  res.json(await listGames())
})

app.get('/stats/imports', async (_req, res) => {
  res.json(await listImportStats())
})

app.get('/stats/games', (req, res) => {
  const { from, to } = req.query
  res.json(
    listGameActivity(
      typeof from === 'string' ? from : undefined,
      typeof to === 'string' ? to : undefined,
    ),
  )
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

// in development, Vite serves the client
if (!isDevMode()) serveClient(app)

const onListening = () =>
  console.log(`Server listening on ${HOST ?? ''}:${PORT}`)
// without a host, Node listens on all addresses (IPv4 and IPv6)
if (HOST) app.listen(PORT, HOST, onListening)
else app.listen(PORT, onListening)

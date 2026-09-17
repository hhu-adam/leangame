import path from 'node:path'
import express from 'express'
import {
  getAllInstances,
  getInstance,
  startInstance,
  stopInstance,
} from './leanInstances.js'

const PORT = process.env.PORT || 8000
const app = express()

// TODO: allow different games
const TEST_GAME_PATH = path.resolve(import.meta.dirname, '../TestGame')

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.post('/api/lean/start', (_req, res) => {
  try {
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

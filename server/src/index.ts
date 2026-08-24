import express from 'express'

const PORT = process.env.PORT || 8000
const app = express()

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

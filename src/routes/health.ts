import { Router } from 'express'
import { appendFile } from 'node:fs'

export const healthRouter = Router()

healthRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})


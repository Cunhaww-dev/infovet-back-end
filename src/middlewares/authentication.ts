import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/config/env'

// Ensina o TypeScript que req.user existe após esse middleware
declare global {
  namespace Express {
    interface Request {
      user: { id: number }
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: number }
    req.user = { id: payload.id }
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}

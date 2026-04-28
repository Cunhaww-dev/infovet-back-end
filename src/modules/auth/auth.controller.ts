import type { Request, Response } from 'express'
import { loginSchema, registerSchema } from './auth.schema'
import * as authService from './auth.service'

export async function registerController(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors })
    return
  }

  try {
    const data = await authService.register(result.data)
    res.status(201).json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    if (message === 'Email já cadastrado') {
      res.status(409).json({ message })
      return
    }
    res.status(500).json({ message })
  }
}

export async function loginController(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors })
    return
  }

  try {
    const data = await authService.login(result.data)
    res.status(200).json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno, tente novamente mais tarde'
    if (message === 'Credenciais inválidas') {
      res.status(401).json({ message })
      return
    }
    res.status(500).json({ message })
  }
}

// Traduz HTTP para o service

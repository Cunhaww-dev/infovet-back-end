import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8, 'Campo senha deve ter no mínimo 8 caracteres'),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Campo senha deve ter no mínimo 1 caracter'),
})

export type RegisterBody = z.infer<typeof registerSchema>
export type LoginBody = z.infer<typeof loginSchema>

// Validação dos dados de entrada

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { SignOptions } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { env } from '@/config/env'
import { db } from '@/db'
import { veterinarians } from '@/db/schema/veterinarian'
import type { LoginBody, RegisterBody } from './auth.schema'

export async function register(body: RegisterBody) {
  const existing = await db
    .select()
    .from(veterinarians)
    .where(eq(veterinarians.email, body.email))
    .limit(1)

  if (existing.length > 0) {
    throw new Error('Email já cadastrado')
  }

  const senhaHash = await bcrypt.hash(body.password, 10)
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions['expiresIn']

  const [result] = await db.insert(veterinarians).values({
    name: body.name,
    email: body.email,
    password_hash: senhaHash,
  })

  const token = jwt.sign({ id: result.insertId }, env.JWT_SECRET, {
    expiresIn,
  })

  return { token }
}

export async function login(body: LoginBody) {
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions['expiresIn']

  const [vet] = await db
    .select()
    .from(veterinarians)
    .where(eq(veterinarians.email, body.email))
    .limit(1)

  if (!vet) {
    throw new Error('Credenciais inválidas')
  }

  const senhaCorreta = await bcrypt.compare(body.password, vet.password_hash)

  if (!senhaCorreta) {
    throw new Error('Credenciais inválidas')
  }

  const token = jwt.sign({ id: vet.id }, env.JWT_SECRET, {
    expiresIn,
  })

  return { token }
}

// Toda a lógica de negócio acima

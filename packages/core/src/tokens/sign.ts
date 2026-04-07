// sign.ts
import { SignJWT } from 'jose'
import type { JWTPayload } from '../types/index.js'

export async function signToken(
  payload: JWTPayload,
  secret: string,
  expiresInSeconds: number
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret)

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setJti(crypto.randomUUID())
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(secretKey)
}
// verify.ts
import { jwtVerify } from 'jose'
import type { JWTPayload } from '../types/index.js'
import { InvalidTokenError, TokenExpiredError } from '../errors/index.js'

export async function verifyToken(token: string, secret: string): Promise<JWTPayload> {
  const secretKey = new TextEncoder().encode(secret)

  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as unknown as JWTPayload
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes('exp')) throw new TokenExpiredError()
    }
    throw new InvalidTokenError()
  }
}
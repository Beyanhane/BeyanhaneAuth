// decode.ts
import { decrypt } from '../crypto/encrypt.js'
import type { Session } from '../types/index.js'
import { SessionExpiredError, InvalidTokenError } from '../errors/index.js'

export async function decodeSession(token: string, secret: string): Promise<Session> {
  let raw: string

  try {
    raw = await decrypt(token, secret)
  } catch {
    throw new InvalidTokenError('Session token çözülemedi')
  }

  const session: Session = JSON.parse(raw)
  // Date JSON'dan string olarak gelir, geri çevir
  session.expiresAt = new Date(session.expiresAt)

  if (session.expiresAt < new Date()) {
    throw new SessionExpiredError()
  }

  return session
}
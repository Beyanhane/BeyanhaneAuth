// encode.ts
import { encrypt } from '../crypto/encrypt.js'
import type { Session } from '../types/index.js'
import { ConfigurationError } from '../errors/index.js'

export async function encodeSession(session: Session, secret: string): Promise<string> {
  if (!secret || secret.length < 32) {
    throw new ConfigurationError('secret en az 32 karakter olmalı')
  }
  return encrypt(JSON.stringify(session), secret)
}
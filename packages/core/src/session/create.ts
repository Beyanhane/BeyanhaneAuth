// create.ts
import type { User, Session, AuthConfig } from '../types/index.js'

export function createSession(user: User, config: AuthConfig): Session {
  const ttl = config.accessTokenTTL ?? 60 * 15 // 15 dakika default

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
    expiresAt: new Date(Date.now() + ttl * 1000),
  }
}
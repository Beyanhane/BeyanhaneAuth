import { describe, it, expect } from 'vitest'
import { createSession } from '../session/create'
import { encodeSession } from '../session/encode'
import { decodeSession } from '../session/decode'
import { SessionExpiredError, ConfigurationError } from '../errors'
import type { User, AuthConfig } from '../types'

describe('Session Operations', () => {
  const secret = 'this-is-a-very-long-and-secure-secret-key-32-chars'
  const user: User = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/image.png'
  }
  const config: AuthConfig = {
    secret: 'this-is-a-very-long-and-secure-secret-key-32-chars',
    accessTokenTTL: 3600
  }

  it('should create, encode and decode a session correctly', async () => {
    const session = createSession(user, config)
    expect(session.user.id).toBe(user.id)
    expect(session.expiresAt).toBeInstanceOf(Date)

    const encoded = await encodeSession(session, secret)
    expect(encoded).toBeDefined()

    const decoded = await decodeSession(encoded, secret)
    expect(decoded.user.email).toEqual(user.email)
    expect(decoded.expiresAt).toBeInstanceOf(Date)
    expect(decoded.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })

  it('should throw ConfigurationError if secret is too short', async () => {
    const session = createSession(user, config)
    const shortSecret = 'short'
    
    await expect(encodeSession(session, shortSecret)).rejects.toThrow(ConfigurationError)
  })

  it('should throw SessionExpiredError for expired session', async () => {
    const expiredConfig: AuthConfig = { 
      secret: 'this-is-a-very-long-and-secure-secret-key-32-chars',
      accessTokenTTL: -60 
    }
    const session = createSession(user, expiredConfig)
    const encoded = await encodeSession(session, secret)

    await expect(decodeSession(encoded, secret)).rejects.toThrow(SessionExpiredError)
  })
})

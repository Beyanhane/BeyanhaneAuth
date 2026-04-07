import { describe, it, expect } from 'vitest'
import { createSession } from '../session/create.js'
import { encodeSession } from '../session/encode.js'
import { decodeSession } from '../session/decode.js'
import {
  SessionExpiredError,
  InvalidTokenError,
  ConfigurationError,
} from '../errors/index.js'
import {
  mockUser,
  mockSession,
  expiredSession,
  mockConfig,
  VALID_SECRET,
  SHORT_SECRET,
} from './helpers/fixtures.js'

describe('createSession', () => {
  it('transfers user info to session object', () => {
    const session = createSession(mockUser, mockConfig)

    expect(session.user.id).toBe(mockUser.id)
    expect(session.user.email).toBe(mockUser.email)
    expect(session.user.name).toBe(mockUser.name)
    expect(session.user.image).toBe(mockUser.image)
  })

  it('expiresAt is 15 minutes later by default', () => {
    const before = Date.now()
    const session = createSession(mockUser, mockConfig)
    const after = Date.now()

    const expectedMin = before + 60 * 15 * 1000
    const expectedMax = after + 60 * 15 * 1000

    expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin)
    expect(session.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax)
  })

  it('calculates expiresAt correctly with custom accessTokenTTL', () => {
    const config = { ...mockConfig, accessTokenTTL: 3600 } // 1 hour
    const before = Date.now()
    const session = createSession(mockUser, config)

    expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(before + 3600 * 1000)
  })

  it('does not transfer user.raw field to session (prevents sensitive data leak)', () => {
    const userWithRaw = { ...mockUser, raw: { accessToken: 'provider-secret' } }
    const session = createSession(userWithRaw, mockConfig)

    expect((session.user as Record<string, unknown>).raw).toBeUndefined()
  })
})

describe('encodeSession', () => {
  it('returns a string', async () => {
    const token = await encodeSession(mockSession, VALID_SECRET)

    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('produces different tokens for the same session (random IV)', async () => {
    const a = await encodeSession(mockSession, VALID_SECRET)
    const b = await encodeSession(mockSession, VALID_SECRET)

    expect(a).not.toBe(b)
  })

  it('throws ConfigurationError for secret shorter than 32 characters', async () => {
    await expect(encodeSession(mockSession, SHORT_SECRET)).rejects.toBeInstanceOf(
      ConfigurationError
    )
  })

  it('throws ConfigurationError for empty secret', async () => {
    await expect(encodeSession(mockSession, '')).rejects.toBeInstanceOf(ConfigurationError)
  })
})

describe('decodeSession', () => {
  it('round-trip encode → decode is successful', async () => {
    const token = await encodeSession(mockSession, VALID_SECRET)
    const decoded = await decodeSession(token, VALID_SECRET)

    expect(decoded.user.id).toBe(mockSession.user.id)
    expect(decoded.user.email).toBe(mockSession.user.email)
    expect(decoded.expiresAt).toBeInstanceOf(Date)
  })

  it('correctly converts expiresAt to Date object', async () => {
    const token = await encodeSession(mockSession, VALID_SECRET)
    const decoded = await decodeSession(token, VALID_SECRET)

    expect(decoded.expiresAt).toBeInstanceOf(Date)
    expect(decoded.expiresAt.getTime()).toBeCloseTo(mockSession.expiresAt.getTime(), -2)
  })

  it('throws SessionExpiredError for expired session', async () => {
    const token = await encodeSession(expiredSession, VALID_SECRET)

    await expect(decodeSession(token, VALID_SECRET)).rejects.toBeInstanceOf(SessionExpiredError)
  })

  it('throws InvalidTokenError for wrong secret', async () => {
    const token = await encodeSession(mockSession, VALID_SECRET)

    await expect(
      decodeSession(token, 'wrong-secret-key-that-is-32-chars!!!')
    ).rejects.toBeInstanceOf(InvalidTokenError)
  })

  it('throws InvalidTokenError for malformed token', async () => {
    await expect(decodeSession('malformed-token-value', VALID_SECRET)).rejects.toBeInstanceOf(
      InvalidTokenError
    )
  })

  it('complete round-trip — user fields are complete', async () => {
    const token = await encodeSession(mockSession, VALID_SECRET)
    const { user } = await decodeSession(token, VALID_SECRET)

    expect(user).toEqual(mockSession.user)
  })
})

describe('session pipeline — integration', () => {
  it('complete flow createSession → encode → decode works', async () => {
    const session = createSession(mockUser, mockConfig)
    const token = await encodeSession(session, VALID_SECRET)
    const decoded = await decodeSession(token, VALID_SECRET)

    expect(decoded.user.id).toBe(mockUser.id)
    expect(decoded.user.email).toBe(mockUser.email)
    expect(decoded.expiresAt).toBeInstanceOf(Date)
    expect(decoded.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })
})
import { describe, it, expect, vi } from 'vitest'
import { signToken } from '../tokens/sign.js'
import { verifyToken } from '../tokens/verify.js'
import { TokenExpiredError, InvalidTokenError } from '../errors/index.js'
import { VALID_SECRET, mockJWTPayload } from './helpers/fixtures.js'

describe('signToken', () => {
  it('returns a string JWT', async () => {
    const token = await signToken(mockJWTPayload, VALID_SECRET, 900)

    // JWT format: header.payload.signature
    expect(token.split('.')).toHaveLength(3)
  })

  it('transfers payload fields into the token', async () => {
    const token = await signToken(mockJWTPayload, VALID_SECRET, 900)
    const verified = await verifyToken(token, VALID_SECRET)

    expect(verified.sub).toBe(mockJWTPayload.sub)
    expect(verified.email).toBe(mockJWTPayload.email)
  })

  it('produces a unique jti for each signing', async () => {
    const a = await signToken(mockJWTPayload, VALID_SECRET, 900)
    const b = await signToken(mockJWTPayload, VALID_SECRET, 900)

    const payloadA = JSON.parse(Buffer.from(a.split('.')[1], 'base64url').toString())
    const payloadB = JSON.parse(Buffer.from(b.split('.')[1], 'base64url').toString())

    expect(payloadA.jti).not.toBe(payloadB.jti)
  })

  it('calculates the exp field correctly', async () => {
    const ttl = 900 // 15 minutes
    const before = Math.floor(Date.now() / 1000)
    const token = await signToken(mockJWTPayload, VALID_SECRET, ttl)
    const after = Math.floor(Date.now() / 1000)

    const { exp } = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())

    expect(exp).toBeGreaterThanOrEqual(before + ttl)
    expect(exp).toBeLessThanOrEqual(after + ttl)
  })

  it('cannot verify a token signed with a different secret', async () => {
    const token = await signToken(mockJWTPayload, VALID_SECRET, 900)

    await expect(
      verifyToken(token, 'completely-different-secret-32chars!!')
    ).rejects.toBeInstanceOf(InvalidTokenError)
  })
})

describe('verifyToken', () => {
  it('verifies a valid token and returns the payload', async () => {
    const token = await signToken(mockJWTPayload, VALID_SECRET, 900)
    const payload = await verifyToken(token, VALID_SECRET)

    expect(payload.sub).toBe(mockJWTPayload.sub)
    expect(payload.email).toBe(mockJWTPayload.email)
  })

  it('throws TokenExpiredError for an expired token', async () => {
    // TTL = 1 second, then advance time
    const token = await signToken(mockJWTPayload, VALID_SECRET, 1)

    vi.useFakeTimers()
    vi.advanceTimersByTime(2000)

    await expect(verifyToken(token, VALID_SECRET)).rejects.toBeInstanceOf(TokenExpiredError)

    vi.useRealTimers()
  })

  it('throws InvalidTokenError for a broken token', async () => {
    await expect(verifyToken('this.is.not.a.valid.token', VALID_SECRET)).rejects.toBeInstanceOf(
      InvalidTokenError
    )
  })

  it('throws InvalidTokenError for a completely random string', async () => {
    await expect(verifyToken('randomstring', VALID_SECRET)).rejects.toBeInstanceOf(
      InvalidTokenError
    )
  })

  it('throws InvalidTokenError for an empty string', async () => {
    await expect(verifyToken('', VALID_SECRET)).rejects.toBeInstanceOf(InvalidTokenError)
  })

  it('rejects a token with a manipulated payload', async () => {
    const token = await signToken(mockJWTPayload, VALID_SECRET, 900)
    const parts = token.split('.')

    // Decode payload base64, change it, re-encode
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    payload.email = 'hacker@evil.com'
    parts[1] = Buffer.from(JSON.stringify(payload)).toString('base64url')

    const tamperedToken = parts.join('.')

    await expect(verifyToken(tamperedToken, VALID_SECRET)).rejects.toBeInstanceOf(InvalidTokenError)
  })
})
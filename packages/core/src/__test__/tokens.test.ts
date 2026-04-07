import { describe, it, expect, vi } from 'vitest'
import { signToken } from '../tokens/sign'
import { verifyToken } from '../tokens/verify'
import { TokenExpiredError, InvalidTokenError } from '../errors'

describe('Token Operations', () => {
  const secret = 'test-token-secret'
  const payload = { sub: 'user123', email: 'test@example.com' }

  it('should sign and verify a token correctly', async () => {
    const token = await signToken(payload, secret, 3600)
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    const decoded = await verifyToken(token, secret)
    expect(decoded.sub).toEqual(payload.sub)
    expect(decoded.email).toEqual(payload.email)
  })

  it('should throw InvalidTokenError for invalid secret', async () => {
    const token = await signToken(payload, secret, 3600)
    const wrongSecret = 'wrong-secret'

    await expect(verifyToken(token, wrongSecret)).rejects.toThrow(InvalidTokenError)
  })

  it('should throw TokenExpiredError for expired token', async () => {
    // 0 saniye vererek direkt expire olmasını sağlıyoruz
    const token = await signToken(payload, secret, -10)
    
    await expect(verifyToken(token, secret)).rejects.toThrow(TokenExpiredError)
  })

  it('should throw InvalidTokenError for malformed token', async () => {
    const malformedToken = 'not.a.token'
    await expect(verifyToken(malformedToken, secret)).rejects.toThrow(InvalidTokenError)
  })
})

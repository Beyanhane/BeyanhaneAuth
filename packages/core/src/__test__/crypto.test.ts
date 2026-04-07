import { describe, it, expect } from 'vitest'
import { encrypt, decrypt } from '../crypto/encrypt.js'
import { VALID_SECRET, SHORT_SECRET } from './helpers/fixtures.js'

describe('encrypt', () => {
  it('encrypts string and returns base64url', async () => {
    const result = await encrypt('hello world', VALID_SECRET)

    // should not contain characters other than base64url
    expect(result).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('produces different ciphertext every time for the same plaintext (random IV)', async () => {
    const a = await encrypt('same text', VALID_SECRET)
    const b = await encrypt('same text', VALID_SECRET)

    expect(a).not.toBe(b)
  })

  it('can encrypt empty string', async () => {
    const result = await encrypt('', VALID_SECRET)

    expect(result).toBeTruthy()
  })

  it('can encrypt JSON string', async () => {
    const payload = JSON.stringify({ id: '123', email: 'a@b.com' })
    const result = await encrypt(payload, VALID_SECRET)

    expect(result).toBeTruthy()
  })

  it('can encrypt long text', async () => {
    const longText = 'x'.repeat(10_000)
    const result = await encrypt(longText, VALID_SECRET)

    expect(result).toBeTruthy()
  })
})

describe('decrypt', () => {
  it('returns encrypted text back', async () => {
    const original = 'test data'
    const encrypted = await encrypt(original, VALID_SECRET)
    const decrypted = await decrypt(encrypted, VALID_SECRET)

    expect(decrypted).toBe(original)
  })

  it('round-trips JSON object', async () => {
    const obj = { id: 'user-1', email: 'a@b.com', roles: ['admin'] }
    const encrypted = await encrypt(JSON.stringify(obj), VALID_SECRET)
    const decrypted = JSON.parse(await decrypt(encrypted, VALID_SECRET))

    expect(decrypted).toEqual(obj)
  })

  it('fails to decrypt with wrong secret', async () => {
    const encrypted = await encrypt('secret data', VALID_SECRET)

    await expect(decrypt(encrypted, 'wrong-secret-key-32-chars-padded!!')).rejects.toThrow()
  })

  it('fails to decrypt with malformed ciphertext', async () => {
    await expect(decrypt('not-a-valid-ciphertext', VALID_SECRET)).rejects.toThrow()
  })

  it('works with different secret lengths — under 32 chars works with padding', async () => {
    // padEnd(32) is done inside encrypt, should be consistent
    const encrypted = await encrypt('test', SHORT_SECRET)
    const decrypted = await decrypt(encrypted, SHORT_SECRET)

    expect(decrypted).toBe('test')
  })

  it('preserves unicode characters', async () => {
    const unicode = '🔐 secure text — ñoño'
    const encrypted = await encrypt(unicode, VALID_SECRET)
    const decrypted = await decrypt(encrypted, VALID_SECRET)

    expect(decrypted).toBe(unicode)
  })
})

describe('encrypt / decrypt symmetry guarantee', () => {
  it('round-trip successful for 100 different strings', async () => {
    const texts = Array.from({ length: 100 }, (_, i) => `test-${i}-${'x'.repeat(i)}`)

    for (const text of texts) {
      const encrypted = await encrypt(text, VALID_SECRET)
      const decrypted = await decrypt(encrypted, VALID_SECRET)
      expect(decrypted).toBe(text)
    }
  })
})
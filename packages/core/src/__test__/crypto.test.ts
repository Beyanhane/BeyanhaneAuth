import { describe, it, expect } from 'vitest'
import { encrypt, decrypt } from '../crypto/encrypt'

describe('Crypto Operations', () => {
  const secret = 'test-secret-key-that-is-at-least-thirty-two-chars'
  const message = 'Hello, this is a secret message.'

  it('should encrypt and decrypt a message correctly', async () => {
    const encrypted = await encrypt(message, secret)
    expect(encrypted).toBeDefined()
    expect(encrypted).not.toEqual(message)

    const decrypted = await decrypt(encrypted, secret)
    expect(decrypted).toEqual(message)
  })

  it('should fail to decrypt with the wrong secret', async () => {
    const encrypted = await encrypt(message, secret)
    const wrongSecret = 'wrong-secret-key-that-is-the-wrong-one'

    await expect(decrypt(encrypted, wrongSecret)).rejects.toThrow()
  })

  it('should handle special characters and long messages', async () => {
    const longMessage = 'A'.repeat(1000) + ' özel karakterler: ğüşıöç'
    const encrypted = await encrypt(longMessage, secret)
    const decrypted = await decrypt(encrypted, secret)
    expect(decrypted).toEqual(longMessage)
  })
})

import { base64url } from 'jose'
import { encrypt, decrypt } from '../crypto/encrypt.js'

/**
 * Generates a cryptographically strong random token.
 * Default length is 32 characters.
 */
export function generateCSRFToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return base64url.encode(array).slice(0, length)
}

/**
 * Creates a signed CSRF token if a secret is provided.
 * If not, it just returns the token as is.
 */
export async function createSignedCSRFToken(token: string, secret: string): Promise<string> {
  // We use our existing encryption as a "signature"
  // If decrypt(signedToken, secret) equals token, it's valid.
  return await encrypt(token, secret)
}

/**
 * Verifies a CSRF token against a stored (possibly signed) token.
 */
export async function verifyCSRFToken(
  requestToken: string,
  cookieToken: string,
  secret?: string
): Promise<boolean> {
  if (!requestToken || !cookieToken) return false

  let actualCookieToken = cookieToken

  // If a secret is provided, the cookieToken is expected to be encrypted
  if (secret) {
    try {
      actualCookieToken = await decrypt(cookieToken, secret)
    } catch (e) {
      return false // Decryption failed or tampered with
    }
  }

  // Use a constant-time comparison to prevent timing attacks
  return constantTimeCompare(requestToken, actualCookieToken)
}

/**
 * Simple constant-time comparison helper.
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

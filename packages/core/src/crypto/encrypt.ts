import { base64url } from 'jose'

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // Standard for AES-GCM

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const raw = encoder.encode(secret.padEnd(32, '0').slice(0, 32))
  return crypto.subtle.importKey('raw', raw, { name: ALGORITHM, length: KEY_LENGTH }, false, [
    'encrypt',
    'decrypt',
  ])
}

export async function encrypt(plaintext: string, secret: string): Promise<string> {
  const key = await deriveKey(secret)
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encoded = new TextEncoder().encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded)

  // iv + ciphertext'i birleştirip base64url yap
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.byteLength)

  return base64url.encode(combined)
}

export async function decrypt(ciphertextB64: string, secret: string): Promise<string> {
  const key = await deriveKey(secret)
  const combined = base64url.decode(ciphertextB64)

  const iv = combined.subarray(0, IV_LENGTH)
  const ciphertext = combined.subarray(IV_LENGTH)

  const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv: iv as any }, key, ciphertext as any)

  return new TextDecoder().decode(plaintext)
}
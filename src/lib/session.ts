// Cookie-based session using Web Crypto HMAC-SHA256
// Works in both Next.js Edge (middleware) and Node runtimes (API routes)

export const COOKIE_NAME = 'cc_session'
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

const getSecret = () => process.env.SESSION_SECRET ?? 'dev-secret-must-change-in-production-32ch'

function toB64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromB64(s: string): Uint8Array<ArrayBuffer> {
  const bytes = Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  return new Uint8Array(bytes.buffer as ArrayBuffer)
}

async function hmacKey(usage: 'sign' | 'verify'): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  )
}

export type SessionPayload = {
  userId: string
  role: 'customer' | 'chef'
  iat: number
}

export async function signSession(userId: string, role: 'customer' | 'chef'): Promise<string> {
  const payload: SessionPayload = { userId, role, iat: Date.now() }
  const data = toB64(new TextEncoder().encode(JSON.stringify(payload)).buffer as ArrayBuffer)
  const key = await hmacKey('sign')
  const sig = toB64(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data)))
  return `${data}.${sig}`
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return null
    const key = await hmacKey('verify')
    const valid = await crypto.subtle.verify(
      'HMAC', key, fromB64(sig), new TextEncoder().encode(data)
    )
    if (!valid) return null
    const payload: SessionPayload = JSON.parse(
      new TextDecoder().decode(fromB64(data))
    )
    if (Date.now() - payload.iat > SESSION_MAX_AGE * 1000) return null
    return payload
  } catch {
    return null
  }
}

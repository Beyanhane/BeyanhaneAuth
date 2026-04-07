// ─── User ────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: Date
  /** Access to raw data from the provider (optional) */
  raw?: Record<string, unknown>
}

// ─── Token ───────────────────────────────────────────────────────────────────

export interface AccessToken {
  /** Signed as JWT string */
  value: string
  expiresAt: Date
}

export interface RefreshToken {
  value: string
  expiresAt: Date
}

export interface TokenPair {
  accessToken: AccessToken
  refreshToken: RefreshToken
}

/** Expected fields in JWT payload */
export interface JWTPayload {
  sub: string       // user ID
  email: string
  name?: string
  iat?: number
  exp?: number
  jti?: string      // JWT ID — for token blacklist
}

// ─── Session ─────────────────────────────────────────────────────────────────

export type SessionStrategy = 'jwt' | 'database'

export interface Session {
  user: Pick<User, 'id' | 'email' | 'name' | 'image'>
  accessToken?: string
  expiresAt: Date
}

// ─── Provider Contract ───────────────────────────────────────────────────────

export interface AuthProvider<TCredentials = Record<string, string>> {
  id: string
  name: string
  type: 'oauth' | 'credentials' | 'email'
  authorize(credentials: TCredentials): Promise<User | null>
}

// ─── Adapter Contract ────────────────────────────────────────────────────────

export interface AuthAdapter {
  createUser(user: Omit<User, 'id'>): Promise<User>
  findUserById(id: string): Promise<User | null>
  findUserByEmail(email: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
  deleteUser(id: string): Promise<void>

  createSession(userId: string, expiresAt: Date): Promise<{ token: string }>
  findSession(token: string): Promise<(Session & { userId: string }) | null>
  deleteSession(token: string): Promise<void>
  deleteExpiredSessions(): Promise<void>
}

// ─── Configuration ───────────────────────────────────────────────────────────

export interface AuthConfig {
  /** Secret key for JWT signing — min 32 characters */
  secret: string
  /** Session strategy: 'jwt' (stateless) or 'database' (stateful) */
  strategy?: SessionStrategy
  /** Access token lifetime in seconds. Default: 15 minutes */
  accessTokenTTL?: number
  /** Refresh token lifetime in seconds. Default: 7 days */
  refreshTokenTTL?: number
  /** Registered providers */
  providers?: AuthProvider[]
  /** DB adapter — required if strategy is 'database' */
  adapter?: AuthAdapter
  /** Cookie settings */
  cookies?: {
    sessionToken?: { name: string; options?: Record<string, unknown> }
  }
}
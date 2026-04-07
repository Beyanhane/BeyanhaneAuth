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

// ─── Account ─────────────────────────────────────────────────────────────────

export interface Account {
  id: string
  userId: string
  provider: string
  providerAccountId: string
  type: 'oauth' | 'credentials' | 'email'
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
  refresh_token?: string
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

  linkAccount(account: Omit<Account, 'id'>): Promise<Account>
  unlinkAccount(provider: string, providerAccountId: string): Promise<void>
  findAccount(provider: string, providerAccountId: string): Promise<Account | null>
}

// ─── Callbacks ───────────────────────────────────────────────────────────────

export interface Callbacks {
  /**
   * Called whenever a user signs in.
   * Return true to allow sign in, false to deny, or a string to redirect.
   */
  signIn?: (params: {
    user: User
    account: Account | null
    credentials?: Record<string, unknown>
  }) => Promise<boolean | string>

  /**
   * Called whenever a JWT is created or updated.
   * Use this to add custom claims to the JWT.
   */
  jwt?: (params: {
    token: JWTPayload
    user?: User
    account?: Account | null
    isNewUser?: boolean
  }) => Promise<JWTPayload>

  /**
   * Called whenever a session is checked.
   * Control what is returned to the client.
   */
  session?: (params: {
    session: Session
    token: JWTPayload
    user?: User
  }) => Promise<Session>

  /**
   * Called on redirect.
   */
  redirect?: (params: { url: string; baseUrl: string }) => Promise<string>
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
    csrfToken?: { name: string; options?: Record<string, unknown> }
    callbackUrl?: { name: string; options?: Record<string, unknown> }
  }
  /** Event callbacks */
  callbacks?: Callbacks
  /** Debug mode */
  debug?: boolean
}
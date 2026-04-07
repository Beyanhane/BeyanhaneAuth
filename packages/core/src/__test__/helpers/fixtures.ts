import type { User, Session, AuthConfig, JWTPayload } from '../../types/index.js'

export const VALID_SECRET = 'super-secret-key-that-is-at-least-32-chars!!'
export const SHORT_SECRET = 'tooshort'

export const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  image: 'https://example.com/avatar.png',
}

export const mockSession: Session = {
  user: {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    image: mockUser.image,
  },
  expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 dakika sonra
}

export const expiredSession: Session = {
  user: mockSession.user,
  expiresAt: new Date(Date.now() - 1000), // 1 saniye önce dolmuş
}

export const mockJWTPayload: JWTPayload = {
  sub: mockUser.id,
  email: mockUser.email,
  name: mockUser.name,
}

export const mockConfig: AuthConfig = {
  secret: VALID_SECRET,
  strategy: 'jwt',
  accessTokenTTL: 60 * 15,
  refreshTokenTTL: 60 * 60 * 24 * 7,
}
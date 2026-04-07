export type AuthErrorCode =
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'SESSION_NOT_FOUND'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED'
  | 'ADAPTER_REQUIRED'
  | 'PROVIDER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'CONFIGURATION_ERROR'
  | 'ENCRYPTION_FAILED'
  | 'DECRYPTION_FAILED'

export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(message: string, code: AuthErrorCode) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    // Fix V8 stack trace if available
    if ('captureStackTrace' in Error) {
      (Error as any).captureStackTrace(this, AuthError)
    }
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = 'Token geçersiz') {
    super(message, 'INVALID_TOKEN')
    this.name = 'InvalidTokenError'
  }
}

export class TokenExpiredError extends AuthError {
  constructor(message = 'Token süresi dolmuş') {
    super(message, 'TOKEN_EXPIRED')
    this.name = 'TokenExpiredError'
  }
}

export class SessionNotFoundError extends AuthError {
  constructor(message = 'Session bulunamadı') {
    super(message, 'SESSION_NOT_FOUND')
    this.name = 'SessionNotFoundError'
  }
}

export class SessionExpiredError extends AuthError {
  constructor(message = 'Session süresi dolmuş') {
    super(message, 'SESSION_EXPIRED')
    this.name = 'SessionExpiredError'
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Yetkilendirme gerekli') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ConfigurationError extends AuthError {
  constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR')
    this.name = 'ConfigurationError'
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = 'Geçersiz kimlik bilgileri') {
    super(message, 'INVALID_CREDENTIALS')
    this.name = 'InvalidCredentialsError'
  }
}
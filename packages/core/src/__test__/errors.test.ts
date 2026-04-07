import { describe, it, expect } from 'vitest'
import {
  AuthError,
  InvalidTokenError,
  TokenExpiredError,
  SessionNotFoundError,
  SessionExpiredError,
  UnauthorizedError,
  ConfigurationError,
  InvalidCredentialsError,
} from '../errors/index.js'

describe('AuthError — base class', () => {
  it('AuthError carries correct code and message', () => {
    const err = new AuthError('an error', 'INVALID_TOKEN')

    expect(err.message).toBe('an error')
    expect(err.code).toBe('INVALID_TOKEN')
    expect(err.name).toBe('AuthError')
  })

  it('is recognized as instance of Error', () => {
    const err = new AuthError('test', 'UNAUTHORIZED')

    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(AuthError)
  })

  it('stack trace exists', () => {
    const err = new AuthError('test', 'CONFIGURATION_ERROR')

    expect(err.stack).toBeDefined()
  })
})

describe('Subclass errors', () => {
  const cases = [
    {
      cls: InvalidTokenError,
      name: 'InvalidTokenError',
      code: 'INVALID_TOKEN',
      defaultMsg: 'Invalid token',
    },
    {
      cls: TokenExpiredError,
      name: 'TokenExpiredError',
      code: 'TOKEN_EXPIRED',
      defaultMsg: 'Token expired',
    },
    {
      cls: SessionNotFoundError,
      name: 'SessionNotFoundError',
      code: 'SESSION_NOT_FOUND',
      defaultMsg: 'Session not found',
    },
    {
      cls: SessionExpiredError,
      name: 'SessionExpiredError',
      code: 'SESSION_EXPIRED',
      defaultMsg: 'Session expired',
    },
    {
      cls: UnauthorizedError,
      name: 'UnauthorizedError',
      code: 'UNAUTHORIZED',
      defaultMsg: 'Unauthorized',
    },
    {
      cls: InvalidCredentialsError,
      name: 'InvalidCredentialsError',
      code: 'INVALID_CREDENTIALS',
      defaultMsg: 'Invalid credentials',
    },
  ] as const

  it.each(cases)('$name — default message, code and instanceof are correct', ({ cls, name, code, defaultMsg }) => {
    const err = new cls()

    expect(err.message).toBe(defaultMsg)
    expect(err.code).toBe(code)
    expect(err.name).toBe(name)
    expect(err).toBeInstanceOf(AuthError)
    expect(err).toBeInstanceOf(Error)
  })

  it.each(cases)('$name — custom message can be passed', ({ cls }) => {
    const err = new cls('custom message' as never)

    expect(err.message).toBe('custom message')
  })

  it('ConfigurationError requires message', () => {
    const err = new ConfigurationError('secret missing')

    expect(err.message).toBe('secret missing')
    expect(err.code).toBe('CONFIGURATION_ERROR')
    expect(err.name).toBe('ConfigurationError')
  })

  it('can be distinguished with instanceof in catch block', () => {
    function riskyOp() {
      throw new TokenExpiredError()
    }

    expect(() => riskyOp()).toThrow(TokenExpiredError)
    expect(() => riskyOp()).toThrow(AuthError)
  })
})
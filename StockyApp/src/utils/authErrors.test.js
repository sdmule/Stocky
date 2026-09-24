import { describe, expect, it } from 'vitest'
import { authErrorMessage } from './authErrors'

describe('authErrorMessage', () => {
  it('maps a known Firebase auth error code to a friendly message', () => {
    expect(authErrorMessage({ code: 'auth/weak-password' })).toBe(
      'Password must be at least 6 characters.',
    )
  })

  it('falls back to the error message for an unmapped code', () => {
    expect(authErrorMessage({ code: 'auth/mystery', message: 'boom' })).toBe('boom')
  })

  it('falls back to a generic message when nothing is available', () => {
    expect(authErrorMessage({})).toBe('Something went wrong. Please try again.')
  })

  it('handles a null/undefined error', () => {
    expect(authErrorMessage(undefined)).toBe('Something went wrong. Please try again.')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

const { watchAuthState, signUp, logIn, logOut, createUserProfile, getUserProfile } = vi.hoisted(
  () => ({
    watchAuthState: vi.fn(),
    signUp: vi.fn(),
    logIn: vi.fn(),
    logOut: vi.fn(),
    createUserProfile: vi.fn(),
    getUserProfile: vi.fn(),
  }),
)

vi.mock('@/services/auth', () => ({ watchAuthState, signUp, logIn, logOut }))
vi.mock('@/services/firestore', () => ({ createUserProfile, getUserProfile }))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('registers a user, creates a profile, and loads it', async () => {
    const credential = { user: { uid: 'u1' } }
    signUp.mockResolvedValue(credential)
    getUserProfile.mockResolvedValue({ gender: null })

    const { useAuth } = await import('./useAuth')
    const { register, profile } = useAuth()
    const user = await register('a@b.com', 'password')

    expect(signUp).toHaveBeenCalledWith('a@b.com', 'password')
    expect(createUserProfile).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ gender: null, dailyCalorieGoal: null }),
    )
    expect(user).toBe(credential.user)
    expect(profile.value).toEqual({ gender: null })
  })

  it('logs in and loads the profile', async () => {
    const credential = { user: { uid: 'u2' } }
    logIn.mockResolvedValue(credential)
    getUserProfile.mockResolvedValue({ gender: 'female' })

    const { useAuth } = await import('./useAuth')
    const { login, profile } = useAuth()
    const user = await login('a@b.com', 'password')

    expect(logIn).toHaveBeenCalledWith('a@b.com', 'password')
    expect(user).toBe(credential.user)
    expect(profile.value).toEqual({ gender: 'female' })
  })

  it('logs out by delegating to the auth service', async () => {
    const { useAuth } = await import('./useAuth')
    const { logout } = useAuth()
    await logout()
    expect(logOut).toHaveBeenCalled()
  })

  it('refreshProfile is a no-op when there is no user', async () => {
    const { useAuth } = await import('./useAuth')
    const { refreshProfile, profile } = useAuth()
    await refreshProfile()
    expect(getUserProfile).not.toHaveBeenCalled()
    expect(profile.value).toBeNull()
  })
})

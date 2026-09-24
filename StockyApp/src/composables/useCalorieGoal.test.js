import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const { saveUserProfile } = vi.hoisted(() => ({ saveUserProfile: vi.fn() }))
const { refreshProfile } = vi.hoisted(() => ({ refreshProfile: vi.fn() }))

vi.mock('@/services/firestore', () => ({ saveUserProfile }))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ user: ref({ uid: 'u1' }), refreshProfile }),
}))

import { useCalorieGoal } from './useCalorieGoal'

const profile = { gender: 'male', age: 30, weightKg: 70, heightCm: 175, activityLevel: 'sedentary' }

describe('useCalorieGoal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('saves profile details and refreshes the profile', async () => {
    const { saveProfileDetails } = useCalorieGoal()
    await saveProfileDetails(profile)

    expect(saveUserProfile).toHaveBeenCalledWith('u1', profile)
    expect(refreshProfile).toHaveBeenCalled()
  })

  it('saves the goal rate with a computed daily calorie goal and returns it', async () => {
    const { saveGoalRate, goalFor } = useCalorieGoal()
    const expectedGoal = goalFor(profile, -1)

    const result = await saveGoalRate(profile, -1)

    expect(result).toBe(expectedGoal)
    expect(saveUserProfile).toHaveBeenCalledWith('u1', {
      goalRateLbPerWeek: -1,
      dailyCalorieGoal: expectedGoal,
    })
    expect(refreshProfile).toHaveBeenCalled()
  })

  it('tdeeFor rounds the TDEE for a profile', () => {
    const { tdeeFor } = useCalorieGoal()
    expect(Number.isInteger(tdeeFor(profile))).toBe(true)
  })
})

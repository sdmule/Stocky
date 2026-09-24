import { useAuth } from '@/composables/useAuth'
import { saveUserProfile } from '@/services/firestore'
import { calculateDailyCalorieGoal, calculateTdee } from '@/utils/calorie'

export function useCalorieGoal() {
  const { user, refreshProfile } = useAuth()

  async function saveProfileDetails({ gender, age, heightCm, weightKg, activityLevel }) {
    await saveUserProfile(user.value.uid, { gender, age, heightCm, weightKg, activityLevel })
    await refreshProfile()
  }

  async function saveGoalRate(profile, goalRateLbPerWeek) {
    const dailyCalorieGoal = calculateDailyCalorieGoal(profile, goalRateLbPerWeek)
    await saveUserProfile(user.value.uid, { goalRateLbPerWeek, dailyCalorieGoal })
    await refreshProfile()
    return dailyCalorieGoal
  }

  function tdeeFor(profile) {
    return Math.round(calculateTdee(profile))
  }

  function goalFor(profile, goalRateLbPerWeek) {
    return calculateDailyCalorieGoal(profile, goalRateLbPerWeek)
  }

  return { saveProfileDetails, saveGoalRate, tdeeFor, goalFor }
}

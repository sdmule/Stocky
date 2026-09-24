export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  { value: 'light', label: 'Light (exercise 1-3 days/week)', multiplier: 1.375 },
  { value: 'active', label: 'Active (exercise 3-5 days/week)', multiplier: 1.55 },
  { value: 'very_active', label: 'Very active (exercise 6-7 days/week)', multiplier: 1.725 },
]

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other / prefer not to say' },
]

// Preset weekly weight-change rates offered in onboarding and the goal-rate panel.
// Negative = lose weight, positive = gain weight, 0 = maintain.
export const GOAL_RATE_PRESETS = [
  { value: -2, label: 'Lose 2 lb/week' },
  { value: -1.5, label: 'Lose 1.5 lb/week' },
  { value: -1, label: 'Lose 1 lb/week' },
  { value: -0.5, label: 'Lose 0.5 lb/week' },
  { value: 0, label: 'Maintain weight' },
  { value: 0.5, label: 'Gain 0.5 lb/week' },
  { value: 1, label: 'Gain 1 lb/week' },
]

const CALORIES_PER_POUND = 3500

export function activityMultiplier(activityLevel) {
  return ACTIVITY_LEVELS.find((l) => l.value === activityLevel)?.multiplier ?? 1.2
}

// Mifflin-St Jeor BMR. "other" gender uses the midpoint of the male/female constants.
export function calculateBmr({ gender, age, weightKg, heightCm }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  if (gender === 'male') return base + 5
  if (gender === 'female') return base - 161
  return base - 78
}

export function calculateTdee({ gender, age, weightKg, heightCm, activityLevel }) {
  const bmr = calculateBmr({ gender, age, weightKg, heightCm })
  return bmr * activityMultiplier(activityLevel)
}

// goalRateLbPerWeek: negative to lose, positive to gain, 0 to maintain.
export function calculateDailyCalorieGoal(profile, goalRateLbPerWeek) {
  const tdee = calculateTdee(profile)
  const dailyAdjustment = (goalRateLbPerWeek * CALORIES_PER_POUND) / 7
  return Math.round(tdee + dailyAdjustment)
}

export function calculateEntryCalories(caloriesPerServing, quantity) {
  return Math.round(caloriesPerServing * quantity)
}

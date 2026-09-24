import { describe, expect, it } from 'vitest'
import {
  activityMultiplier,
  calculateBmr,
  calculateDailyCalorieGoal,
  calculateEntryCalories,
  calculateTdee,
} from './calorie'

describe('activityMultiplier', () => {
  it('returns the multiplier for a known level', () => {
    expect(activityMultiplier('active')).toBe(1.55)
  })

  it('falls back to sedentary for an unknown level', () => {
    expect(activityMultiplier('nonsense')).toBe(1.2)
  })
})

describe('calculateBmr', () => {
  const base = { age: 30, weightKg: 70, heightCm: 175 }

  it('adds 5 for male', () => {
    expect(calculateBmr({ ...base, gender: 'male' })).toBeCloseTo(1648.75)
  })

  it('subtracts 161 for female', () => {
    expect(calculateBmr({ ...base, gender: 'female' })).toBeCloseTo(1482.75)
  })

  it('uses the midpoint for other', () => {
    expect(calculateBmr({ ...base, gender: 'other' })).toBeCloseTo(1565.75)
  })
})

describe('calculateTdee', () => {
  it('multiplies BMR by the activity multiplier', () => {
    const profile = {
      gender: 'male',
      age: 30,
      weightKg: 70,
      heightCm: 175,
      activityLevel: 'sedentary',
    }
    expect(calculateTdee(profile)).toBeCloseTo(1648.75 * 1.2)
  })
})

describe('calculateDailyCalorieGoal', () => {
  const profile = {
    gender: 'male',
    age: 30,
    weightKg: 70,
    heightCm: 175,
    activityLevel: 'sedentary',
  }
  const tdee = 1648.75 * 1.2

  it('adds a deficit for a negative goal rate', () => {
    expect(calculateDailyCalorieGoal(profile, -1)).toBe(Math.round(tdee - 500))
  })

  it('adds a surplus for a positive goal rate', () => {
    expect(calculateDailyCalorieGoal(profile, 1)).toBe(Math.round(tdee + 500))
  })

  it('leaves TDEE unchanged for a maintain goal', () => {
    expect(calculateDailyCalorieGoal(profile, 0)).toBe(Math.round(tdee))
  })
})

describe('calculateEntryCalories', () => {
  it('rounds calories per serving times quantity', () => {
    expect(calculateEntryCalories(120, 1.5)).toBe(180)
  })

  it('rounds to the nearest whole calorie', () => {
    expect(calculateEntryCalories(33, 1 / 3)).toBe(11)
  })
})

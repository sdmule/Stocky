import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const { listLogEntries } = vi.hoisted(() => ({ listLogEntries: vi.fn() }))

vi.mock('@/services/firestore', () => ({ listLogEntries }))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ user: ref({ uid: 'u1' }) }),
}))

import { useTrends } from './useTrends'

describe('useTrends', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 2))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads totals for each of the last N days ending today', async () => {
    listLogEntries.mockResolvedValue([])

    const { loadTrend, days, loading } = useTrends()
    const promise = loadTrend(3)
    expect(loading.value).toBe(true)
    await promise

    expect(loading.value).toBe(false)
    expect(days.value.map((d) => d.dateKey)).toEqual(['2025-12-31', '2026-01-01', '2026-01-02'])
  })

  it('sums calories per day correctly', async () => {
    listLogEntries.mockImplementation(async (uid, dateKey) => {
      const map = {
        '2026-01-01': [{ calories: 100 }],
        '2026-01-02': [{ calories: 50 }, { calories: 25 }],
      }
      return map[dateKey] || []
    })

    const { loadTrend, days } = useTrends()
    await loadTrend(2)

    expect(days.value).toEqual([
      { dateKey: '2026-01-01', totalCalories: 100 },
      { dateKey: '2026-01-02', totalCalories: 75 },
    ])
  })
})

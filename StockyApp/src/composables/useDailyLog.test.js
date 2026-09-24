import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const { listLogEntries, createLogEntry, updateLogEntry, deleteLogEntry } = vi.hoisted(() => ({
  listLogEntries: vi.fn(),
  createLogEntry: vi.fn(),
  updateLogEntry: vi.fn(),
  deleteLogEntry: vi.fn(),
}))

vi.mock('@/services/firestore', () => ({
  listLogEntries,
  createLogEntry,
  updateLogEntry,
  deleteLogEntry,
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ user: ref({ uid: 'u1' }) }),
}))

import { useDailyLog } from './useDailyLog'

describe('useDailyLog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads entries for a day', async () => {
    listLogEntries.mockResolvedValue([{ id: 'e1', meal: 'breakfast', calories: 100 }])
    const { loadDay, entries, dateKey, loading } = useDailyLog()

    const promise = loadDay('2026-01-01')
    expect(loading.value).toBe(true)
    await promise

    expect(listLogEntries).toHaveBeenCalledWith('u1', '2026-01-01')
    expect(dateKey.value).toBe('2026-01-01')
    expect(entries.value).toHaveLength(1)
    expect(loading.value).toBe(false)
  })

  it('filters entries by meal', async () => {
    listLogEntries.mockResolvedValue([
      { id: 'e1', meal: 'breakfast', calories: 100 },
      { id: 'e2', meal: 'lunch', calories: 200 },
    ])
    const { loadDay, entriesForMeal } = useDailyLog()
    await loadDay('2026-01-01')

    expect(entriesForMeal('breakfast').value.map((e) => e.id)).toEqual(['e1'])
    expect(entriesForMeal('lunch').value.map((e) => e.id)).toEqual(['e2'])
  })

  it('computes total calories across all entries', async () => {
    listLogEntries.mockResolvedValue([
      { id: 'e1', meal: 'breakfast', calories: 100 },
      { id: 'e2', meal: 'lunch', calories: 250 },
    ])
    const { loadDay, totalCalories } = useDailyLog()
    await loadDay('2026-01-01')

    expect(totalCalories.value).toBe(350)
  })

  it('adds an entry with calories computed from quantity', async () => {
    listLogEntries.mockResolvedValue([])
    createLogEntry.mockResolvedValue({ id: 'new1' })
    const { loadDay, addEntry, entries, totalCalories } = useDailyLog()
    await loadDay('2026-01-01')

    await addEntry({
      foodItem: { id: 'f1', name: 'Apple', caloriesPerServing: 80, servingUnit: 'serving' },
      meal: 'snacks',
      quantity: 2,
    })

    expect(createLogEntry).toHaveBeenCalledWith(
      'u1',
      '2026-01-01',
      expect.objectContaining({ foodItemId: 'f1', calories: 160, meal: 'snacks' }),
    )
    expect(entries.value).toHaveLength(1)
    expect(totalCalories.value).toBe(160)
  })

  it('edits an entry and recomputes calories from the new quantity', async () => {
    listLogEntries.mockResolvedValue([{ id: 'e1', meal: 'lunch', quantity: 1, calories: 100 }])
    const { loadDay, editEntry, entries } = useDailyLog()
    await loadDay('2026-01-01')

    await editEntry('e1', 3)

    expect(updateLogEntry).toHaveBeenCalledWith('u1', '2026-01-01', 'e1', {
      quantity: 3,
      calories: 300,
    })
    expect(entries.value[0].calories).toBe(300)
    expect(entries.value[0].quantity).toBe(3)
  })

  it('does nothing when editing an entry that does not exist', async () => {
    listLogEntries.mockResolvedValue([])
    const { loadDay, editEntry } = useDailyLog()
    await loadDay('2026-01-01')

    await editEntry('missing', 3)

    expect(updateLogEntry).not.toHaveBeenCalled()
  })

  it('removes an entry', async () => {
    listLogEntries.mockResolvedValue([{ id: 'e1', meal: 'lunch', calories: 100 }])
    const { loadDay, removeEntry, entries } = useDailyLog()
    await loadDay('2026-01-01')

    await removeEntry('e1')

    expect(deleteLogEntry).toHaveBeenCalledWith('u1', '2026-01-01', 'e1')
    expect(entries.value).toHaveLength(0)
  })
})

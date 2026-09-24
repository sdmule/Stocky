import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const { listFoodItems, createFoodItem, updateFoodItem, deleteFoodItem } = vi.hoisted(() => ({
  listFoodItems: vi.fn(),
  createFoodItem: vi.fn(),
  updateFoodItem: vi.fn(),
  deleteFoodItem: vi.fn(),
}))

vi.mock('@/services/firestore', () => ({
  listFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ user: ref({ uid: 'u1' }) }),
}))

describe('useFoodLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('loads food items sorted from the server', async () => {
    listFoodItems.mockResolvedValue([{ id: 'f1', name: 'Apple' }])
    const { useFoodLibrary } = await import('./useFoodLibrary')
    const { loadFoodItems, items, loaded } = useFoodLibrary()

    await loadFoodItems()

    expect(listFoodItems).toHaveBeenCalledWith('u1')
    expect(items.value).toEqual([{ id: 'f1', name: 'Apple' }])
    expect(loaded.value).toBe(true)
  })

  it('adds a food item and keeps the list sorted by name', async () => {
    listFoodItems.mockResolvedValue([{ id: 'f1', name: 'Banana' }])
    createFoodItem.mockResolvedValue({ id: 'f2' })
    const { useFoodLibrary } = await import('./useFoodLibrary')
    const { loadFoodItems, addFoodItem, items } = useFoodLibrary()
    await loadFoodItems()

    const newId = await addFoodItem({ name: 'Apple', caloriesPerServing: 80 })

    expect(newId).toBe('f2')
    expect(items.value.map((i) => i.name)).toEqual(['Apple', 'Banana'])
  })

  it('edits a food item in place', async () => {
    listFoodItems.mockResolvedValue([{ id: 'f1', name: 'Apple', caloriesPerServing: 80 }])
    const { useFoodLibrary } = await import('./useFoodLibrary')
    const { loadFoodItems, editFoodItem, items } = useFoodLibrary()
    await loadFoodItems()

    await editFoodItem('f1', { caloriesPerServing: 90 })

    expect(updateFoodItem).toHaveBeenCalledWith('u1', 'f1', { caloriesPerServing: 90 })
    expect(items.value[0].caloriesPerServing).toBe(90)
  })

  it('removes a food item', async () => {
    listFoodItems.mockResolvedValue([{ id: 'f1', name: 'Apple' }])
    const { useFoodLibrary } = await import('./useFoodLibrary')
    const { loadFoodItems, removeFoodItem, items } = useFoodLibrary()
    await loadFoodItems()

    await removeFoodItem('f1')

    expect(deleteFoodItem).toHaveBeenCalledWith('u1', 'f1')
    expect(items.value).toHaveLength(0)
  })
})

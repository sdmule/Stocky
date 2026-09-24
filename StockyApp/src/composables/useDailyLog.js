import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import {
  createLogEntry,
  deleteLogEntry,
  listLogEntries,
  updateLogEntry,
} from '@/services/firestore'
import { calculateEntryCalories } from '@/utils/calorie'

export const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks']

export function useDailyLog() {
  const { user } = useAuth()
  const dateKey = ref(null)
  const entries = ref([])
  const loading = ref(false)

  async function loadDay(date) {
    dateKey.value = date
    loading.value = true
    entries.value = await listLogEntries(user.value.uid, date)
    loading.value = false
  }

  function entriesForMeal(meal) {
    return computed(() => entries.value.filter((e) => e.meal === meal))
  }

  const totalCalories = computed(() => entries.value.reduce((sum, e) => sum + e.calories, 0))

  async function addEntry({ foodItem, meal, quantity }) {
    const calories = calculateEntryCalories(foodItem.caloriesPerServing, quantity)
    const entry = {
      foodItemId: foodItem.id,
      foodName: foodItem.name,
      servingUnit: foodItem.servingUnit,
      meal,
      quantity,
      calories,
    }
    const docRef = await createLogEntry(user.value.uid, dateKey.value, entry)
    entries.value.push({ id: docRef.id, ...entry })
  }

  async function editEntry(entryId, quantity) {
    const entry = entries.value.find((e) => e.id === entryId)
    if (!entry) return
    const caloriesPerServing = entry.calories / entry.quantity
    const calories = calculateEntryCalories(caloriesPerServing, quantity)
    await updateLogEntry(user.value.uid, dateKey.value, entryId, { quantity, calories })
    entry.quantity = quantity
    entry.calories = calories
  }

  async function removeEntry(entryId) {
    await deleteLogEntry(user.value.uid, dateKey.value, entryId)
    entries.value = entries.value.filter((e) => e.id !== entryId)
  }

  return {
    dateKey,
    entries,
    loading,
    totalCalories,
    loadDay,
    entriesForMeal,
    addEntry,
    editEntry,
    removeEntry,
  }
}

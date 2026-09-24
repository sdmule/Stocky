import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { listLogEntries } from '@/services/firestore'
import { lastNDayKeys } from '@/utils/date'

export function useTrends() {
  const { user } = useAuth()
  const days = ref([])
  const loading = ref(false)

  async function loadTrend(numDays) {
    loading.value = true
    const dateKeys = lastNDayKeys(numDays)
    const results = await Promise.all(
      dateKeys.map(async (dateKey) => {
        const entries = await listLogEntries(user.value.uid, dateKey)
        const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)
        return { dateKey, totalCalories }
      }),
    )
    days.value = results
    loading.value = false
  }

  return { days, loading, loadTrend }
}

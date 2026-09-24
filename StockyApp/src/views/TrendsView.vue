<script setup>
import { ref, watch } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import TrendBarChart from '@/components/log/TrendBarChart.vue'
import { useAuth } from '@/composables/useAuth'
import { useTrends } from '@/composables/useTrends'

const { profile } = useAuth()
const { days, loading, loadTrend } = useTrends()

const range = ref(7)

watch(range, () => loadTrend(range.value), { immediate: true })
</script>

<template>
  <AppShell title="Trends">
    <div class="trends-view__toggle">
      <button
        type="button"
        :class="{ 'trends-view__toggle-btn--active': range === 7 }"
        class="trends-view__toggle-btn"
        @click="range = 7"
      >
        7 days
      </button>
      <button
        type="button"
        :class="{ 'trends-view__toggle-btn--active': range === 30 }"
        class="trends-view__toggle-btn"
        @click="range = 30"
      >
        30 days
      </button>
    </div>

    <p v-if="loading">Loading…</p>
    <TrendBarChart v-else :days="days" :goal="profile?.dailyCalorieGoal ?? 0" />
  </AppShell>
</template>

<style scoped>
.trends-view__toggle {
  display: flex;
  gap: 0.5rem;
}

.trends-view__toggle-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  font-weight: 600;
}

.trends-view__toggle-btn--active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
</style>

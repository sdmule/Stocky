<script setup>
import { computed } from 'vue'
import { formatDisplayDate } from '@/utils/date'

const props = defineProps({
  days: { type: Array, required: true }, // [{ dateKey, totalCalories }]
  goal: { type: Number, default: 0 },
})

const maxValue = computed(() => Math.max(props.goal, ...props.days.map((d) => d.totalCalories), 1))
</script>

<template>
  <div class="trend-bar-chart">
    <div v-for="day in days" :key="day.dateKey" class="trend-bar-chart__row">
      <span class="trend-bar-chart__label">{{ formatDisplayDate(day.dateKey) }}</span>
      <div class="trend-bar-chart__track">
        <div
          class="trend-bar-chart__fill"
          :class="{ 'trend-bar-chart__fill--over': goal && day.totalCalories > goal }"
          :style="{ width: (day.totalCalories / maxValue) * 100 + '%' }"
        />
      </div>
      <span class="trend-bar-chart__value">{{ day.totalCalories }}</span>
    </div>
  </div>
</template>

<style scoped>
.trend-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.trend-bar-chart__row {
  display: grid;
  grid-template-columns: 4.5rem 1fr 3rem;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.trend-bar-chart__label {
  color: var(--color-text-muted);
}

.trend-bar-chart__track {
  height: 0.6rem;
  border-radius: 999px;
  background: var(--color-border);
  overflow: hidden;
}

.trend-bar-chart__fill {
  height: 100%;
  background: var(--color-accent);
}

.trend-bar-chart__fill--over {
  background: var(--color-danger);
}

.trend-bar-chart__value {
  text-align: right;
  font-weight: 600;
}
</style>

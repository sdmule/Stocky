<script setup>
import { computed } from 'vue'
import { GOAL_RATE_PRESETS } from '@/utils/calorie'
import { useCalorieGoal } from '@/composables/useCalorieGoal'

const props = defineProps({
  profile: { type: Object, required: true }, // { gender, age, heightCm, weightKg, activityLevel }
  modelValue: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

const { tdeeFor, goalFor } = useCalorieGoal()

const maintenanceCalories = computed(() => tdeeFor(props.profile))

const options = computed(() =>
  GOAL_RATE_PRESETS.map((preset) => ({
    ...preset,
    calories: goalFor(props.profile, preset.value),
  })),
)
</script>

<template>
  <div class="goal-rate-options">
    <p class="goal-rate-options__maintenance">
      Maintenance: <strong>{{ maintenanceCalories }} kcal/day</strong>
    </p>

    <ul class="goal-rate-options__list">
      <li v-for="opt in options" :key="opt.value">
        <button
          type="button"
          class="goal-rate-options__item"
          :class="{ 'goal-rate-options__item--active': opt.value === modelValue }"
          @click="$emit('update:modelValue', opt.value)"
        >
          <span>{{ opt.label }}</span>
          <span class="goal-rate-options__calories">{{ opt.calories }} kcal</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.goal-rate-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.goal-rate-options__maintenance {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.goal-rate-options__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.goal-rate-options__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
}

.goal-rate-options__item--active {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
  color: var(--color-accent);
}

.goal-rate-options__calories {
  font-weight: 700;
}
</style>

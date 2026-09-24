<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  max: { type: Number, required: true },
})

const percent = computed(() => {
  if (!props.max) return 0
  return Math.min(100, Math.round((props.value / props.max) * 100))
})

const isOver = computed(() => props.value > props.max)
</script>

<template>
  <div class="progress-bar" role="progressbar" :aria-valuenow="value" :aria-valuemax="max">
    <div
      class="progress-bar__fill"
      :class="{ 'progress-bar__fill--over': isOver }"
      :style="{ width: percent + '%' }"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: 0.6rem;
  border-radius: 999px;
  background: var(--color-border);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.2s ease;
}

.progress-bar__fill--over {
  background: var(--color-danger);
}
</style>

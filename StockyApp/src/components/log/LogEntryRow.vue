<script setup>
defineProps({
  entry: { type: Object, required: true }, // { id, foodName, servingUnit, quantity, calories }
})
defineEmits(['edit', 'delete'])
</script>

<template>
  <li class="log-entry-row">
    <div class="log-entry-row__info">
      <span class="log-entry-row__name">{{ entry.foodName }}</span>
      <span class="log-entry-row__meta">{{ entry.quantity }} × {{ entry.servingUnit }}</span>
    </div>
    <div class="log-entry-row__right">
      <span class="log-entry-row__calories">{{ entry.calories }} kcal</span>
      <button
        type="button"
        class="log-entry-row__icon-btn"
        aria-label="Edit"
        @click="$emit('edit', entry)"
      >
        ✏️
      </button>
      <button
        type="button"
        class="log-entry-row__icon-btn"
        aria-label="Delete"
        @click="$emit('delete', entry)"
      >
        🗑️
      </button>
    </div>
  </li>
</template>

<style scoped>
.log-entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.log-entry-row__info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.log-entry-row__name {
  font-weight: 600;
}

.log-entry-row__meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.log-entry-row__right {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.log-entry-row__calories {
  font-weight: 600;
  font-size: 0.9rem;
}

.log-entry-row__icon-btn {
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.25rem;
}
</style>

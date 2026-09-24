<script setup>
import { computed } from 'vue'
import LogEntryRow from '@/components/log/LogEntryRow.vue'

const props = defineProps({
  title: { type: String, required: true },
  entries: { type: Array, required: true },
})
defineEmits(['edit-entry', 'delete-entry'])

const subtotal = computed(() => props.entries.reduce((sum, e) => sum + e.calories, 0))
</script>

<template>
  <section class="meal-section">
    <header class="meal-section__header">
      <h2 class="meal-section__title">{{ title }}</h2>
      <span class="meal-section__subtotal">{{ subtotal }} kcal</span>
    </header>

    <ul v-if="entries.length" class="meal-section__list">
      <LogEntryRow
        v-for="entry in entries"
        :key="entry.id"
        :entry="entry"
        @edit="$emit('edit-entry', entry)"
        @delete="$emit('delete-entry', entry)"
      />
    </ul>
    <p v-else class="meal-section__empty">Nothing logged yet.</p>
  </section>
</template>

<style scoped>
.meal-section {
  background: var(--color-surface);
  border-radius: 0.75rem;
  padding: 0.9rem 1rem;
}

.meal-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.meal-section__title {
  font-size: 1rem;
  font-weight: 700;
  text-transform: capitalize;
}

.meal-section__subtotal {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.meal-section__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.meal-section__empty {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  padding: 0.25rem 0;
}
</style>

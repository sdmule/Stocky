<script setup>
defineProps({
  food: { type: Object, required: true }, // { id, name, servingUnit, caloriesPerServing }
})
defineEmits(['select', 'edit', 'delete'])
</script>

<template>
  <li class="food-list-item">
    <button type="button" class="food-list-item__main" @click="$emit('select', food)">
      <span class="food-list-item__name">{{ food.name }}</span>
      <span class="food-list-item__meta">
        {{ food.servingUnit }} · {{ food.caloriesPerServing }} kcal
      </span>
    </button>
    <div class="food-list-item__actions">
      <button
        type="button"
        class="food-list-item__icon-btn"
        aria-label="Edit"
        @click="$emit('edit', food)"
      >
        ✏️
      </button>
      <button
        type="button"
        class="food-list-item__icon-btn"
        aria-label="Delete"
        @click="$emit('delete', food)"
      >
        🗑️
      </button>
    </div>
  </li>
</template>

<style scoped>
.food-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border);
}

.food-list-item__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0.25rem 0;
}

.food-list-item__name {
  font-weight: 600;
}

.food-list-item__meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.food-list-item__actions {
  display: flex;
  gap: 0.25rem;
}

.food-list-item__icon-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.35rem;
}
</style>

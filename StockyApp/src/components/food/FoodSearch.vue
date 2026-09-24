<script setup>
import { computed, ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import FoodListItem from '@/components/food/FoodListItem.vue'

const props = defineProps({
  items: { type: Array, required: true },
})
const emit = defineEmits(['select', 'create-new'])

const query = ref('')

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter((item) => item.name.toLowerCase().includes(q))
})
</script>

<template>
  <div class="food-search">
    <BaseInput v-model="query" placeholder="Search your foods…" />

    <ul v-if="filteredItems.length" class="food-search__list">
      <FoodListItem
        v-for="item in filteredItems"
        :key="item.id"
        :food="item"
        @select="$emit('select', item)"
      />
    </ul>
    <p v-else class="food-search__empty">No matching foods in your library yet.</p>

    <button type="button" class="food-search__create" @click="$emit('create-new', query)">
      + Create new food item
    </button>
  </div>
</template>

<style scoped>
.food-search {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.food-search__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 45vh;
  overflow-y: auto;
}

.food-search__empty {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem 0;
}

.food-search__create {
  background: none;
  border: 1px dashed var(--color-border);
  border-radius: 0.6rem;
  padding: 0.6rem;
  color: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
}
</style>

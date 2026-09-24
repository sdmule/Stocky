<script setup>
import { onMounted, ref } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import FoodListItem from '@/components/food/FoodListItem.vue'
import FoodItemForm from '@/components/food/FoodItemForm.vue'
import { useFoodLibrary } from '@/composables/useFoodLibrary'

const { items, loadFoodItems, addFoodItem, editFoodItem, removeFoodItem } = useFoodLibrary()

const modalStep = ref(null) // null | 'create' | 'edit'
const editingItem = ref(null)

onMounted(loadFoodItems)

function openCreate() {
  editingItem.value = null
  modalStep.value = 'create'
}

function openEdit(item) {
  editingItem.value = item
  modalStep.value = 'edit'
}

async function handleSubmit(item) {
  if (modalStep.value === 'edit') {
    await editFoodItem(editingItem.value.id, item)
  } else {
    await addFoodItem(item)
  }
  closeModal()
}

async function handleDelete(item) {
  await removeFoodItem(item.id)
}

function closeModal() {
  modalStep.value = null
  editingItem.value = null
}
</script>

<template>
  <AppShell title="Food library">
    <button type="button" class="food-library-view__add" @click="openCreate">
      + New food item
    </button>

    <ul v-if="items.length" class="food-library-view__list">
      <FoodListItem
        v-for="item in items"
        :key="item.id"
        :food="item"
        @select="openEdit"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </ul>
    <p v-else class="food-library-view__empty">You haven't added any foods yet.</p>

    <BaseModal
      v-if="modalStep"
      :title="modalStep === 'edit' ? 'Edit food item' : 'New food item'"
      @close="closeModal"
    >
      <FoodItemForm :initial-value="editingItem || undefined" @submit="handleSubmit" />
    </BaseModal>
  </AppShell>
</template>

<style scoped>
.food-library-view__add {
  background: none;
  border: 1px dashed var(--color-border);
  border-radius: 0.6rem;
  padding: 0.6rem;
  color: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
}

.food-library-view__list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: var(--color-surface);
  border-radius: 0.75rem;
  padding: 0.25rem 1rem;
}

.food-library-view__empty {
  color: var(--color-text-muted);
  text-align: center;
  padding: 2rem 0;
}
</style>

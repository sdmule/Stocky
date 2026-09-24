<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import FoodSearch from '@/components/food/FoodSearch.vue'
import FoodItemForm from '@/components/food/FoodItemForm.vue'
import QuantityInput from '@/components/log/QuantityInput.vue'
import { MEALS, useDailyLog } from '@/composables/useDailyLog'
import { useFoodLibrary } from '@/composables/useFoodLibrary'
import { todayKey } from '@/utils/date'

const router = useRouter()
const { items: foodItems, loaded: foodLoaded, loadFoodItems, addFoodItem } = useFoodLibrary()
const { dateKey, addEntry } = useDailyLog()

const step = ref('search') // 'search' | 'create' | 'details'
const selectedFood = ref(null)
const meal = ref('breakfast')
const quantity = ref(1)
const loadingFoods = ref(!foodLoaded.value)
const loadError = ref('')

const mealOptions = MEALS.map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))

onMounted(async () => {
  dateKey.value = todayKey()
  if (!foodLoaded.value) {
    try {
      await loadFoodItems()
    } catch (e) {
      loadError.value = 'Could not load your foods. Please try again.'
    }
  }
  loadingFoods.value = false
})

function selectFood(food) {
  selectedFood.value = food
  quantity.value = 1
  step.value = 'details'
}

function startCreateFood(prefillName) {
  selectedFood.value = { name: prefillName || '', servingUnit: '', caloriesPerServing: '' }
  step.value = 'create'
}

async function handleCreateFood(newFood) {
  const id = await addFoodItem(newFood)
  selectedFood.value = { id, ...newFood }
  quantity.value = 1
  step.value = 'details'
}

async function handleLogFood() {
  await addEntry({ foodItem: selectedFood.value, meal: meal.value, quantity: quantity.value })
  router.push({ name: 'dashboard' })
}

function goBack() {
  if (step.value === 'search') {
    router.push({ name: 'dashboard' })
  } else {
    step.value = 'search'
  }
}
</script>

<template>
  <AppShell title="Log food">
    <template #actions>
      <button type="button" @click="goBack">‹ Back</button>
    </template>

    <p v-if="step === 'search' && loadingFoods" class="log-food-view__loading">
      Loading your foods…
    </p>
    <p v-else-if="step === 'search' && loadError" class="log-food-view__error">{{ loadError }}</p>
    <FoodSearch
      v-else-if="step === 'search'"
      :items="foodItems"
      @select="selectFood"
      @create-new="startCreateFood"
    />

    <FoodItemForm
      v-else-if="step === 'create'"
      :initial-value="selectedFood"
      submit-label="Save & continue"
      @submit="handleCreateFood"
    />

    <div v-else class="log-food-view__details">
      <BaseSelect v-model="meal" label="Meal" :options="mealOptions" required />
      <QuantityInput
        v-model="quantity"
        :food="selectedFood"
        submit-label="Log food"
        @submit="handleLogFood"
      />
    </div>
  </AppShell>
</template>

<style scoped>
.log-food-view__details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.log-food-view__loading {
  color: var(--color-text-muted);
  text-align: center;
  padding: 2rem 0;
}

.log-food-view__error {
  color: var(--color-danger);
  text-align: center;
  padding: 2rem 0;
}
</style>

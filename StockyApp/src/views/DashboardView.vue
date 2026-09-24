<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import MealSection from '@/components/log/MealSection.vue'
import QuantityInput from '@/components/log/QuantityInput.vue'
import { useAuth } from '@/composables/useAuth'
import { MEALS, useDailyLog } from '@/composables/useDailyLog'
import { addDays, formatDisplayDate, todayKey } from '@/utils/date'

const props = defineProps({
  date: { type: String, default: null },
})

const router = useRouter()
const { profile } = useAuth()
const { totalCalories, entriesForMeal, loadDay, editEntry, removeEntry } = useDailyLog()

const currentDate = computed(() => props.date || todayKey())
const remaining = computed(() => (profile.value?.dailyCalorieGoal ?? 0) - totalCalories.value)

const mealEntries = {
  breakfast: entriesForMeal('breakfast'),
  lunch: entriesForMeal('lunch'),
  dinner: entriesForMeal('dinner'),
  snacks: entriesForMeal('snacks'),
}

const editingEntry = ref(null)
const quantity = ref(1)

onMounted(() => loadDay(currentDate.value))
watch(currentDate, () => loadDay(currentDate.value))

function goToDay(delta) {
  const next = addDays(currentDate.value, delta)
  router.push(next === todayKey() ? { name: 'dashboard' } : { name: 'day', params: { date: next } })
}

function openEditEntry(entry) {
  editingEntry.value = entry
  quantity.value = entry.quantity
}

async function handleEditEntry() {
  await editEntry(editingEntry.value.id, quantity.value)
  editingEntry.value = null
}

async function handleDeleteEntry(entry) {
  await removeEntry(entry.id)
}
</script>

<template>
  <AppShell :title="formatDisplayDate(currentDate)">
    <template #actions>
      <button type="button" @click="goToDay(-1)">‹</button>
      <button type="button" :disabled="currentDate === todayKey()" @click="goToDay(1)">›</button>
    </template>

    <section class="dashboard-summary">
      <div class="dashboard-summary__numbers">
        <div>
          <span class="dashboard-summary__value">{{ totalCalories }}</span>
          <span class="dashboard-summary__label">consumed</span>
        </div>
        <div>
          <span class="dashboard-summary__value">{{ profile?.dailyCalorieGoal ?? '—' }}</span>
          <span class="dashboard-summary__label">goal</span>
        </div>
        <div>
          <span
            class="dashboard-summary__value"
            :class="{ 'dashboard-summary__value--over': remaining < 0 }"
          >
            {{ remaining }}
          </span>
          <span class="dashboard-summary__label">remaining</span>
        </div>
      </div>
      <ProgressBar :value="totalCalories" :max="profile?.dailyCalorieGoal || 1" />
    </section>

    <MealSection
      v-for="meal in MEALS"
      :key="meal"
      :title="meal"
      :entries="mealEntries[meal].value"
      @edit-entry="openEditEntry"
      @delete-entry="handleDeleteEntry"
    />

    <BaseModal v-if="editingEntry" title="Edit entry" @close="editingEntry = null">
      <QuantityInput
        v-model="quantity"
        :food="{
          name: editingEntry.foodName,
          servingUnit: editingEntry.servingUnit,
          caloriesPerServing: editingEntry.calories / editingEntry.quantity,
        }"
        submit-label="Save changes"
        @submit="handleEditEntry"
      />
    </BaseModal>
  </AppShell>
</template>

<style scoped>
.dashboard-summary {
  background: var(--color-surface);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dashboard-summary__numbers {
  display: flex;
  justify-content: space-between;
}

.dashboard-summary__numbers > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.dashboard-summary__value {
  font-size: 1.25rem;
  font-weight: 800;
}

.dashboard-summary__value--over {
  color: var(--color-danger);
}

.dashboard-summary__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>

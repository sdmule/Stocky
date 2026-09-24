<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SideSheet from '@/components/common/SideSheet.vue'
import ProfileDetailsForm from '@/components/profile/ProfileDetailsForm.vue'
import GoalRateOptions from '@/components/profile/GoalRateOptions.vue'
import { useAuth } from '@/composables/useAuth'
import { useCalorieGoal } from '@/composables/useCalorieGoal'
import { GOAL_RATE_PRESETS } from '@/utils/calorie'

const { profile, logout } = useAuth()
const { saveProfileDetails, saveGoalRate } = useCalorieGoal()
const router = useRouter()

const savedMessage = ref('')
const goalSheetOpen = ref(false)
const pendingGoalRate = ref(0)

const goalRateLabel = computed(
  () => GOAL_RATE_PRESETS.find((p) => p.value === profile.value?.goalRateLbPerWeek)?.label,
)

async function handleDetailsSubmit(values) {
  await saveProfileDetails(values)
  savedMessage.value = 'Details updated.'
}

function openGoalSheet() {
  pendingGoalRate.value = profile.value?.goalRateLbPerWeek ?? 0
  goalSheetOpen.value = true
}

async function handleGoalRateChange(rate) {
  pendingGoalRate.value = rate
  const goal = await saveGoalRate(profile.value, rate)
  savedMessage.value = `Saved! Your new daily goal is ${goal} kcal.`
  goalSheetOpen.value = false
}

async function handleLogout() {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppShell title="Settings">
    <div class="settings-view">
      <ProfileDetailsForm
        v-if="profile"
        :initial-value="profile"
        submit-label="Save details"
        @submit="handleDetailsSubmit"
      />

      <div v-if="profile" class="settings-view__goal">
        <div>
          <span class="settings-view__goal-label">Weight goal</span>
          <strong>{{ goalRateLabel || 'Maintain weight' }}</strong>
        </div>
        <BaseButton variant="secondary" @click="openGoalSheet">Adjust goal</BaseButton>
      </div>

      <p v-if="savedMessage" class="settings-view__saved">{{ savedMessage }}</p>

      <BaseButton variant="secondary" @click="handleLogout">Log out</BaseButton>

      <SideSheet v-if="goalSheetOpen" title="Weight goal" @close="goalSheetOpen = false">
        <GoalRateOptions
          :model-value="pendingGoalRate"
          :profile="profile"
          @update:model-value="handleGoalRateChange"
        />
      </SideSheet>
    </div>
  </AppShell>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-view__goal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: var(--color-surface);
  border-radius: 0.75rem;
  padding: 0.9rem 1rem;
}

.settings-view__goal-label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.settings-view__saved {
  color: var(--color-accent);
  font-size: 0.9rem;
}
</style>

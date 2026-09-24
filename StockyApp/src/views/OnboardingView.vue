<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import ProfileDetailsForm from '@/components/profile/ProfileDetailsForm.vue'
import GoalRateOptions from '@/components/profile/GoalRateOptions.vue'
import { useCalorieGoal } from '@/composables/useCalorieGoal'

const { saveProfileDetails, saveGoalRate } = useCalorieGoal()
const router = useRouter()

const step = ref('details') // 'details' | 'goal'
const details = ref(null)
const goalRateLbPerWeek = ref(0)

async function handleDetailsSubmit(values) {
  await saveProfileDetails(values)
  details.value = values
  step.value = 'goal'
}

async function handleFinish() {
  await saveGoalRate(details.value, goalRateLbPerWeek.value)
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="onboarding-view">
    <template v-if="step === 'details'">
      <h1 class="onboarding-view__title">Tell us about you</h1>
      <p class="onboarding-view__subtitle">We'll use this to estimate your daily calorie needs.</p>
      <ProfileDetailsForm @submit="handleDetailsSubmit" />
    </template>

    <template v-else>
      <h1 class="onboarding-view__title">Set your goal</h1>
      <p class="onboarding-view__subtitle">
        Pick how fast you'd like to lose or gain weight — your daily calorie target updates
        instantly.
      </p>
      <GoalRateOptions v-model="goalRateLbPerWeek" :profile="details" />
      <BaseButton @click="handleFinish">Finish setup</BaseButton>
    </template>
  </div>
</template>

<style scoped>
.onboarding-view {
  max-width: 360px;
  margin: 0 auto;
  padding: 3rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.onboarding-view__title {
  font-size: 1.5rem;
  font-weight: 800;
}

.onboarding-view__subtitle {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>

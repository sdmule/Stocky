<script setup>
import { reactive, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { ACTIVITY_LEVELS, GENDERS } from '@/utils/calorie'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({
      gender: 'female',
      age: '',
      heightCm: '',
      weightKg: '',
      activityLevel: 'sedentary',
    }),
  },
  submitLabel: { type: String, default: 'Continue' },
})
const emit = defineEmits(['submit'])

const form = reactive({
  gender: props.initialValue.gender ?? 'female',
  age: props.initialValue.age ?? '',
  heightCm: props.initialValue.heightCm ?? '',
  weightKg: props.initialValue.weightKg ?? '',
  activityLevel: props.initialValue.activityLevel ?? 'sedentary',
})

watch(
  () => props.initialValue,
  (value) => {
    form.gender = value.gender ?? 'female'
    form.age = value.age ?? ''
    form.heightCm = value.heightCm ?? ''
    form.weightKg = value.weightKg ?? ''
    form.activityLevel = value.activityLevel ?? 'sedentary'
  },
)

function handleSubmit() {
  emit('submit', {
    gender: form.gender,
    age: Number(form.age),
    heightCm: Number(form.heightCm),
    weightKg: Number(form.weightKg),
    activityLevel: form.activityLevel,
  })
}
</script>

<template>
  <form class="profile-details-form" @submit.prevent="handleSubmit">
    <BaseSelect
      v-model="form.gender"
      label="Gender"
      :options="GENDERS.map((g) => ({ value: g.value, label: g.label }))"
      required
    />
    <BaseInput v-model="form.age" label="Age" type="number" min="0" step="1" required />
    <BaseInput
      v-model="form.heightCm"
      label="Height (cm)"
      type="number"
      min="0"
      step="0.1"
      required
    />
    <BaseInput
      v-model="form.weightKg"
      label="Weight (kg)"
      type="number"
      min="0"
      step="0.1"
      required
    />
    <BaseSelect
      v-model="form.activityLevel"
      label="Activity level"
      :options="ACTIVITY_LEVELS.map((l) => ({ value: l.value, label: l.label }))"
      required
    />
    <BaseButton type="submit">{{ submitLabel }}</BaseButton>
  </form>
</template>

<style scoped>
.profile-details-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>

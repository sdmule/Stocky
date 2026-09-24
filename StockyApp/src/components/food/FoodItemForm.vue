<script setup>
import { reactive, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({ name: '', servingUnit: '', caloriesPerServing: '' }),
  },
  submitLabel: { type: String, default: 'Save food' },
})
const emit = defineEmits(['submit'])

const form = reactive({ ...props.initialValue })

watch(
  () => props.initialValue,
  (value) => Object.assign(form, value),
)

function handleSubmit() {
  emit('submit', {
    name: form.name.trim(),
    servingUnit: form.servingUnit.trim(),
    caloriesPerServing: Number(form.caloriesPerServing),
  })
}
</script>

<template>
  <form class="food-item-form" @submit.prevent="handleSubmit">
    <BaseInput v-model="form.name" label="Food name" placeholder="e.g. Grilled chicken" required />
    <BaseInput
      v-model="form.servingUnit"
      label="Serving size"
      placeholder="e.g. 1 cup, 1/2 cup, 1 count"
      required
    />
    <BaseInput
      v-model="form.caloriesPerServing"
      label="Calories per serving"
      type="number"
      min="0"
      step="1"
      required
    />
    <BaseButton type="submit">{{ submitLabel }}</BaseButton>
  </form>
</template>

<style scoped>
.food-item-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>

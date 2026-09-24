<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const props = defineProps({
  food: { type: Object, required: true }, // { name, servingUnit, caloriesPerServing }
  modelValue: { type: Number, required: true },
  submitLabel: { type: String, default: 'Add to log' },
})
const emit = defineEmits(['update:modelValue', 'submit'])

const calories = computed(() => Math.round(props.food.caloriesPerServing * (props.modelValue || 0)))
</script>

<template>
  <div class="quantity-input">
    <div class="quantity-input__food">
      <strong>{{ food.name }}</strong>
      <span>{{ food.servingUnit }} · {{ food.caloriesPerServing }} kcal/serving</span>
    </div>

    <BaseInput
      label="Quantity (servings)"
      type="number"
      min="0"
      step="0.25"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', Number($event))"
    />

    <p class="quantity-input__total">{{ calories }} kcal total</p>

    <BaseButton @click="$emit('submit')">{{ submitLabel }}</BaseButton>
  </div>
</template>

<style scoped>
.quantity-input {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.quantity-input__food {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.quantity-input__food span {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.quantity-input__total {
  font-weight: 700;
  font-size: 1.1rem;
}
</style>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  step: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: undefined },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="base-input">
    <span v-if="label" class="base-input__label">{{ label }}</span>
    <input
      class="base-input__field"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :step="step"
      :min="min"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.base-input__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.base-input__field {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
}

.base-input__field:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
</style>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  options: { type: Array, required: true }, // [{ value, label }]
  required: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="base-select">
    <span v-if="label" class="base-select__label">{{ label }}</span>
    <select
      class="base-select__field"
      :required="required"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.base-select__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.base-select__field {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
}
</style>

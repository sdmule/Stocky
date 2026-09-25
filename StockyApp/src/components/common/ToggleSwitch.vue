<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="toggle-switch" :class="{ 'toggle-switch--disabled': disabled }">
    <span v-if="label" class="toggle-switch__label">{{ label }}</span>
    <span
      class="toggle-switch__control"
      :class="{ 'toggle-switch__control--on': modelValue }"
      role="switch"
      :aria-checked="modelValue"
    >
      <input
        type="checkbox"
        class="toggle-switch__input"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="toggle-switch__thumb" />
    </span>
  </label>
</template>

<style scoped>
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}

.toggle-switch--disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.toggle-switch__label {
  font-size: 0.95rem;
  color: var(--color-text);
}

.toggle-switch__control {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 2.75rem;
  height: 1.6rem;
  border-radius: 999px;
  background: var(--color-border);
  transition: background-color 0.15s ease;
  flex-shrink: 0;
}

.toggle-switch__control--on {
  background: var(--color-accent);
}

.toggle-switch__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.toggle-switch__thumb {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s ease;
}

.toggle-switch__control--on .toggle-switch__thumb {
  transform: translateX(1.15rem);
}
</style>

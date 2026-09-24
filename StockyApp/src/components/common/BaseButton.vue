<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | danger | ghost
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease;
}

.base-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.base-button--primary {
  background: var(--color-accent);
  color: #fff;
}

.base-button--secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.base-button--danger {
  background: var(--color-danger);
  color: #fff;
}

.base-button--ghost {
  background: transparent;
  color: var(--color-accent);
  padding: 0.5rem;
}
</style>

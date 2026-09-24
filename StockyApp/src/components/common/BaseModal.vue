<script setup>
defineProps({
  title: { type: String, default: '' },
})
defineEmits(['close'])
</script>

<template>
  <div class="base-modal-overlay" @click.self="$emit('close')">
    <div class="base-modal" role="dialog" aria-modal="true">
      <header class="base-modal__header">
        <h2 class="base-modal__title">{{ title }}</h2>
        <button class="base-modal__close" type="button" aria-label="Close" @click="$emit('close')">
          &times;
        </button>
      </header>
      <div class="base-modal__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 50;
}

.base-modal {
  width: 100%;
  max-width: 480px;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--color-surface);
  border-radius: 1rem 1rem 0 0;
  padding: 1.25rem;
  animation: slide-up 0.18s ease-out;
}

@media (min-width: 640px) {
  .base-modal-overlay {
    align-items: center;
  }

  .base-modal {
    border-radius: 1rem;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.base-modal__title {
  font-size: 1.1rem;
  font-weight: 700;
}

.base-modal__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-muted);
}
</style>

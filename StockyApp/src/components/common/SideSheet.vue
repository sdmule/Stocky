<script setup>
defineProps({
  title: { type: String, default: '' },
})
defineEmits(['close'])
</script>

<template>
  <div class="side-sheet-overlay" @click.self="$emit('close')">
    <div class="side-sheet" role="dialog" aria-modal="true">
      <header class="side-sheet__header">
        <h2 class="side-sheet__title">{{ title }}</h2>
        <button class="side-sheet__close" type="button" aria-label="Close" @click="$emit('close')">
          &times;
        </button>
      </header>
      <div class="side-sheet__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 50;
}

.side-sheet {
  width: 88%;
  max-width: 360px;
  height: 100%;
  overflow-y: auto;
  background: var(--color-surface);
  padding: 1.25rem;
  animation: slide-in 0.18s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateX(16px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.side-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.side-sheet__title {
  font-size: 1.1rem;
  font-weight: 700;
}

.side-sheet__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text-muted);
}
</style>

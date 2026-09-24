<script setup>
import BottomNav from '@/components/common/BottomNav.vue'

defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <h1 class="app-shell__title">{{ title }}</h1>
      <div class="app-shell__actions">
        <slot name="actions" />
      </div>
    </header>

    <main class="app-shell__content">
      <slot />
    </main>

    <BottomNav />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.app-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.1rem 0.5rem;
}

.app-shell__title {
  font-size: 1.35rem;
  font-weight: 800;
}

.app-shell__content {
  flex: 1;
  padding: 0.5rem 1.1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

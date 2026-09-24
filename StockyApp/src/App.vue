<script setup>
import { useAuth } from '@/composables/useAuth'

const { authReady } = useAuth()
</script>

<template>
  <div v-if="!authReady" class="app-loading">Loading…</div>
  <router-view v-else />
</template>

<style scoped>
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  color: var(--color-text-muted);
}
</style>

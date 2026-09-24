<script setup>
import { useRouter } from 'vue-router'

const links = [
  { to: { name: 'dashboard' }, label: 'Today', icon: '🍽️' },
  { to: { name: 'food-library' }, label: 'Foods', icon: '📋' },
  { to: { name: 'trends' }, label: 'Trends', icon: '📈' },
  { to: { name: 'settings' }, label: 'Settings', icon: '⚙️' },
]

const router = useRouter()

function goToLogFood() {
  router.push({ name: 'log-food' })
}
</script>

<template>
  <nav class="bottom-nav">
    <div class="bottom-nav__links">
      <router-link
        v-for="link in links"
        :key="link.label"
        :to="link.to"
        class="bottom-nav__item"
        active-class="bottom-nav__item--active"
      >
        <span class="bottom-nav__icon" aria-hidden="true">{{ link.icon }}</span>
        <span>{{ link.label }}</span>
      </router-link>
    </div>
    <div class="bottom-nav__fab-slot">
      <button type="button" class="bottom-nav__fab" aria-label="Log food" @click="goToLogFood">
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <span class="bottom-nav__fab-label">Log</span>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: sticky;
  bottom: 0;
  display: flex;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.bottom-nav__links {
  flex: 0 0 80%;
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom));
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
}

.bottom-nav__icon {
  font-size: 1.25rem;
}

.bottom-nav__item--active {
  color: var(--color-accent);
  font-weight: 600;
}

.bottom-nav__fab-slot {
  flex: 0 0 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
  padding-bottom: calc(0.4rem + env(safe-area-inset-bottom));
}

.bottom-nav__fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  background: linear-gradient(155deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 78%, black));
  color: #fff;
  cursor: pointer;
  transform: translateY(-1.1rem);
  box-shadow:
    0 10px 20px -6px color-mix(in srgb, var(--color-accent) 55%, transparent),
    0 2px 6px rgba(0, 0, 0, 0.25);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.bottom-nav__fab:active {
  transform: translateY(-1.1rem) scale(0.92);
  box-shadow:
    0 4px 10px -4px color-mix(in srgb, var(--color-accent) 55%, transparent),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

.bottom-nav__fab-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transform: translateY(-0.6rem);
}
</style>

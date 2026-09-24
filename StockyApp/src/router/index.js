import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/OnboardingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/day/:date',
      name: 'day',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/food',
      name: 'food-library',
      component: () => import('@/views/FoodLibraryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/trends',
      name: 'trends',
      component: () => import('@/views/TrendsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/log',
      name: 'log-food',
      component: () => import('@/views/LogFoodView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

function waitForAuthReady() {
  const { authReady } = useAuth()
  if (authReady.value) return Promise.resolve()
  return new Promise((resolve) => {
    const stop = setInterval(() => {
      if (authReady.value) {
        clearInterval(stop)
        resolve()
      }
    }, 20)
  })
}

router.beforeEach(async (to) => {
  await waitForAuthReady()
  const { user, profile } = useAuth()

  if (to.meta.requiresAuth && !user.value) {
    return { name: 'login' }
  }
  if (to.meta.guestOnly && user.value) {
    return { name: 'dashboard' }
  }
  if (
    to.meta.requiresAuth &&
    user.value &&
    to.name !== 'onboarding' &&
    profile.value &&
    !profile.value.dailyCalorieGoal
  ) {
    return { name: 'onboarding' }
  }
  return true
})

export default router

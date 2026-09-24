<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { useAuth } from '@/composables/useAuth'
import { authErrorMessage } from '@/utils/authErrors'

const { login } = useAuth()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    await login(form.email, form.password)
    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = authErrorMessage(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-view">
    <h1 class="auth-view__title">Stocky</h1>
    <p class="auth-view__subtitle">Track your daily calories</p>

    <form class="auth-view__form" @submit.prevent="handleSubmit">
      <BaseInput v-model="form.email" type="email" label="Email" required />
      <BaseInput v-model="form.password" type="password" label="Password" required />
      <p v-if="error" class="auth-view__error">{{ error }}</p>
      <BaseButton type="submit" :disabled="submitting">
        {{ submitting ? 'Logging in…' : 'Log in' }}
      </BaseButton>
    </form>

    <p class="auth-view__switch">
      Don't have an account?
      <router-link :to="{ name: 'signup' }">Sign up</router-link>
    </p>
  </div>
</template>

<style scoped>
.auth-view {
  max-width: 360px;
  margin: 0 auto;
  padding: 3rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-view__title {
  font-size: 1.75rem;
  font-weight: 800;
  text-align: center;
}

.auth-view__subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.auth-view__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.auth-view__error {
  color: var(--color-danger);
  font-size: 0.85rem;
}

.auth-view__switch {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
</style>

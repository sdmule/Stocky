import { readonly, ref } from 'vue'
import { logIn, logOut, signUp, watchAuthState } from '@/services/auth'
import { createUserProfile, getUserProfile } from '@/services/firestore'

const user = ref(null)
const profile = ref(null)
const authReady = ref(false)

watchAuthState(async (firebaseUser) => {
  user.value = firebaseUser
  profile.value = firebaseUser ? await getUserProfile(firebaseUser.uid) : null
  authReady.value = true
})

export function useAuth() {
  async function register(email, password) {
    const credential = await signUp(email, password)
    await createUserProfile(credential.user.uid, {
      gender: null,
      age: null,
      heightCm: null,
      weightKg: null,
      activityLevel: null,
      goalRateLbPerWeek: null,
      dailyCalorieGoal: null,
    })
    profile.value = await getUserProfile(credential.user.uid)
    return credential.user
  }

  async function login(email, password) {
    const credential = await logIn(email, password)
    profile.value = await getUserProfile(credential.user.uid)
    return credential.user
  }

  function logout() {
    return logOut()
  }

  async function refreshProfile() {
    if (user.value) {
      profile.value = await getUserProfile(user.value.uid)
    }
  }

  return {
    user: readonly(user),
    profile: readonly(profile),
    authReady: readonly(authReady),
    register,
    login,
    logout,
    refreshProfile,
  }
}

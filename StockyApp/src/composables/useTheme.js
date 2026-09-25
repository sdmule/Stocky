import { readonly, ref } from 'vue'

const STORAGE_KEY = 'stocky-theme'
const THEMES = ['light', 'dark']

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(stored) ? stored : null
  } catch {
    return null
  }
}

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
}

const theme = ref(readStoredTheme() ?? getSystemTheme())
applyTheme(theme.value)

export function useTheme() {
  function setTheme(value) {
    if (!THEMES.includes(value)) return
    theme.value = value
    applyTheme(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
  }
}

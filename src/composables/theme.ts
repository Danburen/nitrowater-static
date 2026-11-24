import { ref } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'nitrowater-static-theme'

function detect(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const theme = ref<Theme>(detect())

export function applyTheme(value: Theme): void {
  document.documentElement.dataset.theme = value
  localStorage.setItem(STORAGE_KEY, value)
}

export function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  applyTheme(theme.value)
}

applyTheme(theme.value)

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const current = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

// Theme for the readable page: follows the OS until the visitor picks one,
// then remembers their choice. The 3D graph is always dark.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('theme')
      } catch {
        // storage blocked — keep following the OS
      }
      if (saved) return
      document.documentElement.classList.toggle('dark', e.matches)
      setTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      // storage blocked — the choice lasts for this visit only
    }
    setTheme(next)
  }

  return { theme, toggle }
}

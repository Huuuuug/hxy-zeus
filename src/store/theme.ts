import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { changeTheme } from '@/utils'

interface ThemeState {
  isDarkMode: boolean
}

interface ThemeAction {
  setTheme: (isDark: boolean) => void
}

export const useThemeState = create<ThemeState & ThemeAction>()(
  persist(
    (set) => ({
      isDarkMode: false,

      setTheme: (isDark: boolean) => {
        set({ isDarkMode: isDark })
        changeTheme(isDark)
      },
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

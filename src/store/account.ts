import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { api } from '@/apis/index.ts'

interface AccountState {
  username: string
  token: string
  refresh_token: string
}

interface AccountAction {
  login: (loginParams: { username: string; password: string }) => Promise<boolean>
  signOut: () => Promise<undefined>
}

export const useAccountStore = create<AccountState & AccountAction>()(
  persist(
    (set) => ({
      username: '',
      token: '',
      refresh_token: '',

      login: async (loginParams: { username: string; password: string }) => {
        const [err, res] = await api.login(loginParams)
        if (!err && res) {
          const { username, token, refresh_token } = res.data
          set({ username, token, refresh_token })
          return true
        }
        return false
      },
      signOut: async () => {
        // TODO
      },
    }),
    {
      name: 'accountInfo',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

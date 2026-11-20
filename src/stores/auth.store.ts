import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession, User } from '@/types'
import { isTokenExpired } from '@/utils/jwt'

interface AuthState {
  user: User | null
  accessToken: string | null
  setSession: (session: AuthSession) => void
  logout: () => void
}

/**
 * Sessão do usuário. Fica salva no localStorage para sobreviver ao F5.
 *
 * Produção: o ideal é o backend guardar o refresh token num cookie HttpOnly
 * e o access token ficar só em memória. A troca é feita em services/api.ts.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: ({ user, accessToken }) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    { name: 'ga-auth' },
  ),
)

/** Hook de leitura: diz se existe sessão válida (token presente e não vencido). */
export const useIsAuthenticated = () =>
  useAuthStore((state) => Boolean(state.user) && !isTokenExpired(state.accessToken))

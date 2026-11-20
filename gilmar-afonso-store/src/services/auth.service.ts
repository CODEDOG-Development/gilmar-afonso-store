import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/types'
import { api } from './api'

export const authService = {
  login: async (payload: LoginPayload) =>
    (await api.post<AuthSession>('/auth/login', payload)).data,

  register: async (payload: RegisterPayload) =>
    (await api.post<AuthSession>('/auth/register', payload)).data,

  me: async () => (await api.get<User>('/auth/me')).data,

  forgotPassword: async (email: string) =>
    (
      await api.post<{ message: string; devResetToken?: string }>('/auth/forgot-password', {
        email,
      })
    ).data,

  resetPassword: async (payload: ResetPasswordPayload) =>
    (await api.post<{ message: string }>('/auth/reset-password', payload)).data,

  /**
   * Login com Google — preparado para a Fase 2.
   * Fluxo previsto: botão → Google Identity Services → credential (ID token)
   * → POST /auth/google { credential } → backend valida e devolve { user, accessToken }.
   */
  loginWithGoogle: async (credential: string) =>
    (await api.post<AuthSession>('/auth/google', { credential })).data,
}

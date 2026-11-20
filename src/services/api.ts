import axios, { isAxiosError } from 'axios'
import { env } from '@/constants/env'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Instância única do Axios usada por todos os serviços.
 * Trocar de API simulada para o backend NestJS = mudar só o .env.
 */
export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  // Import dinâmico: o código da simulação nem entra no build quando VITE_USE_MOCK_API=false
  adapter: env.useMockApi
    ? async (config) => (await import('./mock/adapter')).mockAdapter(config)
    : undefined,
})

// Antes de cada requisição: anexa o token JWT, se houver sessão
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Depois de cada resposta: se o servidor disser 401 (token inválido/vencido), encerra a sessão.
// Ponto para implementar o refresh token quando o backend existir.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      useAuthStore.getState().accessToken
    ) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

/** Extrai uma mensagem amigável de qualquer erro (Axios, rede ou JS). */
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return 'Sem conexão com o servidor. Verifique sua internet.'
    return error.response.data?.message ?? fallback
  }
  return error instanceof Error ? error.message : fallback
}

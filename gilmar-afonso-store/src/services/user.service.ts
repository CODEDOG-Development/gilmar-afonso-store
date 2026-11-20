import type { Address } from '@/types'
import { api } from './api'

/** Dados do cliente logado. Rotas privadas: o interceptor do Axios envia o token. */
export const userService = {
  addresses: async () => (await api.get<Address[]>('/me/addresses')).data,
  saveAddress: async (address: Omit<Address, 'id'>) =>
    (await api.post<Address>('/me/addresses', address)).data,
}

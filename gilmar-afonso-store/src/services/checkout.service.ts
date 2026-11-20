import type { Coupon, CreateOrderPayload, Order, ShippingOption } from '@/types'
import { onlyDigits } from '@/utils/format'
import { api } from './api'

export interface ViaCepAddress {
  street: string
  district: string
  city: string
  state: string
}

export const checkoutService = {
  quoteShipping: async (cep: string, subtotal: number) =>
    (await api.post<ShippingOption[]>('/shipping/quote', { cep: onlyDigits(cep), subtotal })).data,

  validateCoupon: async (code: string) =>
    (await api.post<Coupon>('/coupons/validate', { code })).data,

  createOrder: async (payload: CreateOrderPayload) =>
    (await api.post<Order>('/orders', payload)).data,

  getOrder: async (id: string) => (await api.get<Order>(`/orders/${id}`)).data,

  /**
   * Busca o endereço pelo CEP na ViaCEP (serviço público e gratuito).
   * Usa fetch direto porque é uma API externa, fora do nosso backend.
   */
  async lookupCep(cep: string): Promise<ViaCepAddress | null> {
    const digits = onlyDigits(cep)
    if (digits.length !== 8) return null
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = (await response.json()) as {
        erro?: boolean
        logradouro: string
        bairro: string
        localidade: string
        uf: string
      }
      if (data.erro) return null
      return {
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf,
      }
    } catch {
      return null // sem internet ou ViaCEP fora do ar: o cliente preenche à mão
    }
  },
}

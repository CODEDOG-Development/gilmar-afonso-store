import type { CartItem } from './cart'
import type { Address } from './user'

export type PaymentMethod = 'pix' | 'card' | 'boleto'

/** Gateways preparados para integração (ver src/services/payments). */
export type PaymentProvider = 'mercadopago' | 'stripe' | 'paypal'

export type OrderStatus =
  'pending_payment' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'

export interface ShippingOption {
  id: string
  name: string
  price: number
  /** Prazo em dias úteis. */
  days: number
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  couponDiscount: number
  paymentDiscount: number
  total: number
}

export interface Order {
  id: string
  number: string
  userId: string | null
  customer: { name: string; email: string; phone: string }
  items: CartItem[]
  address: Omit<Address, 'id' | 'isDefault' | 'label'>
  shipping: ShippingOption
  paymentMethod: PaymentMethod
  paymentProvider: PaymentProvider
  couponCode?: string
  totals: OrderTotals
  status: OrderStatus
  /** Dados de pagamento devolvidos pelo gateway (código Pix, linha do boleto...). */
  payment: { pixCode?: string; boletoLine?: string; installments?: number }
  createdAt: string
}

export interface CreateOrderPayload {
  customer: Order['customer']
  items: Pick<CartItem, 'productId' | 'color' | 'size' | 'quantity'>[]
  address: Order['address']
  shippingOptionId: string
  paymentMethod: PaymentMethod
  installments?: number
  couponCode?: string
  /** Token gerado pelo SDK do gateway no navegador. Dados do cartão NUNCA vão para o nosso servidor. */
  paymentToken?: string
}

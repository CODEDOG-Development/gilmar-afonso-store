import { PIX_DISCOUNT } from '@/constants'
import type { CartItem, CartTotals, Coupon, PaymentMethod } from '@/types'

interface TotalsInput {
  items: CartItem[]
  shipping?: number
  coupon?: Coupon | null
  paymentMethod?: PaymentMethod
}

const round = (value: number) => Math.round(value * 100) / 100

/**
 * Única fonte de verdade para os valores do pedido.
 * Carrinho lateral, página do carrinho e checkout chamam esta função,
 * então os números nunca divergem entre as telas.
 *
 * Ordem: subtotal → cupom → desconto Pix (sobre o valor já com cupom) → + frete.
 * O backend deve refazer este cálculo; o front só exibe.
 */
export function calculateTotals({
  items,
  shipping = 0,
  coupon,
  paymentMethod,
}: TotalsInput): CartTotals {
  const subtotal = round(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const couponDiscount = coupon ? round(subtotal * coupon.percentOff) : 0
  const afterCoupon = subtotal - couponDiscount
  const paymentDiscount = paymentMethod === 'pix' ? round(afterCoupon * PIX_DISCOUNT) : 0
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    subtotal,
    shipping,
    couponDiscount,
    paymentDiscount,
    total: round(afterCoupon - paymentDiscount + shipping),
    itemCount,
  }
}

/** Valor de cada parcela sem juros. */
export const installmentValue = (total: number, installments: number) =>
  round(total / Math.max(1, installments))

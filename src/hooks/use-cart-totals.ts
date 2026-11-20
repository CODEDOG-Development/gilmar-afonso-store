import { useMemo } from 'react'
import { useCartStore } from '@/stores/cart.store'
import type { PaymentMethod } from '@/types'
import { calculateTotals } from '@/utils/pricing'

/** Totais do carrinho recalculados só quando itens, cupom, frete ou pagamento mudam. */
export function useCartTotals(options: { shipping?: number; paymentMethod?: PaymentMethod } = {}) {
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const { shipping, paymentMethod } = options
  return useMemo(
    () => calculateTotals({ items, coupon, shipping, paymentMethod }),
    [items, coupon, shipping, paymentMethod],
  )
}

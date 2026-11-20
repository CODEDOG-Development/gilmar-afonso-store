import { useMutation, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { checkoutService } from '@/services/checkout.service'
import { useCartStore } from '@/stores/cart.store'
import { onlyDigits } from '@/utils/format'

export const useShippingQuote = () =>
  useMutation({
    mutationFn: ({ cep, subtotal }: { cep: string; subtotal: number }) =>
      checkoutService.quoteShipping(cep, subtotal),
  })

export function useApplyCoupon() {
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  return useMutation({ mutationFn: checkoutService.validateCoupon, onSuccess: applyCoupon })
}

export const useCreateOrder = () => useMutation({ mutationFn: checkoutService.createOrder })

export const useOrder = (id: string) =>
  useQuery({ queryKey: QUERY_KEYS.order(id), queryFn: () => checkoutService.getOrder(id) })

/** Consulta o CEP na ViaCEP assim que ele tiver 8 dígitos. */
export const useCepLookup = (cep: string) => {
  const digits = onlyDigits(cep)
  return useQuery({
    queryKey: ['cep', digits],
    queryFn: () => checkoutService.lookupCep(digits),
    enabled: digits.length === 8,
    staleTime: Infinity,
    retry: false,
  })
}

/** Opções de frete. Recalcula sozinho quando o CEP fica completo ou o subtotal muda. */
export const useShippingOptions = (cep: string, subtotal: number) => {
  const digits = onlyDigits(cep)
  return useQuery({
    queryKey: ['shipping', digits, subtotal],
    queryFn: () => checkoutService.quoteShipping(digits, subtotal),
    enabled: digits.length === 8 && subtotal > 0,
    retry: false,
  })
}

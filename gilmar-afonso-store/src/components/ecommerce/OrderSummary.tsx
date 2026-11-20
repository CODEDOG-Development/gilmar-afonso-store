import type { CartTotals } from '@/types'
import { cn } from '@/utils/cn'
import { formatMoney } from '@/utils/format'

interface OrderSummaryProps {
  totals: Pick<CartTotals, 'subtotal' | 'shipping' | 'couponDiscount' | 'paymentDiscount' | 'total'>
  /** null = frete ainda não calculado */
  shippingLabel?: string | null
  couponCode?: string
  /** Texto exibido enquanto o frete não foi calculado. */
  pendingShippingText?: string
  className?: string
}

/** Bloco de valores: subtotal, frete, descontos e total. */
export function OrderSummary({
  totals,
  shippingLabel,
  couponCode,
  pendingShippingText = 'Calculado no checkout',
  className,
}: OrderSummaryProps) {
  const shippingText =
    shippingLabel === null
      ? pendingShippingText
      : totals.shipping === 0
        ? 'Grátis'
        : formatMoney(totals.shipping)

  return (
    <dl className={cn('space-y-3 text-sm', className)}>
      <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
      <Row label={shippingLabel ? `Frete (${shippingLabel})` : 'Frete'} value={shippingText} />
      {totals.couponDiscount > 0 && (
        <Row
          label={`Cupom ${couponCode ?? ''}`}
          value={`− ${formatMoney(totals.couponDiscount)}`}
          highlight
        />
      )}
      {totals.paymentDiscount > 0 && (
        <Row label="Desconto Pix" value={`− ${formatMoney(totals.paymentDiscount)}`} highlight />
      )}
      <div className="flex items-center justify-between border-t border-[#d6d3ca] pt-3 text-base">
        <dt className="font-medium">Total</dt>
        <dd className="font-semibold tabular-nums">{formatMoney(totals.total)}</dd>
      </div>
    </dl>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('tabular-nums', highlight && 'text-success')}>{value}</dd>
    </div>
  )
}

import { Truck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '@/constants'
import { formatMoney } from '@/utils/format'

/** Barra que incentiva o cliente a atingir o frete grátis. */
export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className="rounded-sm bg-soft p-3">
      <p className="mb-2 flex items-center gap-2 text-xs">
        <Truck className="size-4 shrink-0" aria-hidden />
        {missing > 0 ? (
          <span>
            Faltam <strong>{formatMoney(missing)}</strong> para o <strong>frete grátis</strong>{' '}
            (PAC)
          </span>
        ) : (
          <span>
            Parabéns! Você ganhou <strong>frete grátis</strong> no PAC.
          </span>
        )}
      </p>
      <div
        className="h-1 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-label="Progresso para o frete grátis"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-foreground transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

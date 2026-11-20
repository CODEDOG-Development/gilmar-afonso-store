import { MAX_INSTALLMENTS, PIX_DISCOUNT } from '@/constants'
import { cn } from '@/utils/cn'
import { formatMoney } from '@/utils/format'
import { installmentValue } from '@/utils/pricing'

interface PriceProps {
  price: number
  compareAtPrice?: number
  /** "detailed" mostra parcelamento e preço no Pix (página de produto). */
  variant?: 'compact' | 'detailed'
  className?: string
}

export function Price({ price, compareAtPrice, variant = 'compact', className }: PriceProps) {
  const onSale = Boolean(compareAtPrice && compareAtPrice > price)
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-baseline gap-2">
        {onSale && (
          <span className="text-xs text-muted-foreground line-through">
            <span className="sr-only">De </span>
            {formatMoney(compareAtPrice as number)}
          </span>
        )}
        <span className={cn('font-semibold', variant === 'detailed' ? 'text-2xl' : 'text-[13px]')}>
          {onSale && <span className="sr-only">Por </span>}
          {formatMoney(price)}
        </span>
      </div>
      {variant === 'detailed' && (
        <div className="space-y-0.5 text-sm text-muted-foreground">
          <p>
            ou {MAX_INSTALLMENTS}x de {formatMoney(installmentValue(price, MAX_INSTALLMENTS))} sem
            juros
          </p>
          <p>
            <strong className="text-foreground">{formatMoney(price * (1 - PIX_DISCOUNT))}</strong>{' '}
            no Pix ({PIX_DISCOUNT * 100}% off)
          </p>
        </div>
      )}
    </div>
  )
}

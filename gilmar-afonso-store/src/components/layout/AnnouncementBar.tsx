import { FREE_SHIPPING_THRESHOLD, MAX_INSTALLMENTS, PIX_DISCOUNT } from '@/constants'
import { formatMoney } from '@/utils/format'

export function AnnouncementBar() {
  return (
    <div className="bg-foreground py-2 text-center text-[11px] tracking-wide text-background">
      Frete grátis acima de {formatMoney(FREE_SHIPPING_THRESHOLD)} · {MAX_INSTALLMENTS}x sem juros ·{' '}
      {PIX_DISCOUNT * 100}% off no Pix
    </div>
  )
}

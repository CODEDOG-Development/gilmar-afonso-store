import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ProductImage'
import { ROUTES } from '@/constants'
import { useCartStore } from '@/stores/cart.store'
import type { CartItem } from '@/types'
import { formatMoney } from '@/utils/format'
import { QuantitySelector } from './QuantitySelector'

/** Linha do carrinho, usada tanto no carrinho lateral quanto na página /carrinho. */
export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <li className="grid grid-cols-[74px_1fr_auto] gap-3 border-b border-border py-4">
      <Link
        to={ROUTES.product(item.slug)}
        onClick={onNavigate}
        className="block h-[88px] w-[74px] overflow-hidden rounded-sm"
      >
        <ProductImage src={item.image} alt={item.name} />
      </Link>
      <div className="min-w-0">
        <h3 className="mt-0.5 truncate text-[13px] font-medium">
          <Link to={ROUTES.product(item.slug)} onClick={onNavigate} className="hover:underline">
            {item.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.color} · {item.size}
        </p>
        <p className="mt-1 text-xs">{formatMoney(item.price)}</p>
        <div className="mt-2.5">
          <QuantitySelector
            value={item.quantity}
            max={item.maxQuantity}
            label={item.name}
            onChange={(quantity) => updateQuantity(item.key, quantity)}
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          type="button"
          onClick={() => removeItem(item.key)}
          aria-label={`Remover ${item.name}`}
          className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <strong className="text-[13px] font-semibold tabular-nums">
          {formatMoney(item.price * item.quantity)}
        </strong>
      </div>
    </li>
  )
}

import { ShoppingBag } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Price } from '@/components/common/Price'
import { ProductImage } from '@/components/common/ProductImage'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants'
import { useCartStore } from '@/stores/cart.store'
import type { Product } from '@/types'
import { discountPercent } from '@/utils/format'

/**
 * Card do produto (visual do .product-card original).
 * memo: a grade inteira não re-renderiza quando só o carrinho muda.
 */
export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen)
  const off = discountPercent(product.price, product.compareAtPrice)
  const soldOut = product.stock === 0

  function quickAdd() {
    // Compra rápida: primeira cor e tamanho M (ou o primeiro disponível)
    const color = product.colors[0]?.name ?? 'Única'
    const size = product.sizes.includes('M') ? 'M' : (product.sizes[0] ?? 'Único')
    addItem({ product, color, size })
    toast.success(`${product.name} adicionado`, {
      description: `${color} · Tamanho ${size}`,
      action: { label: 'Ver carrinho', onClick: () => setDrawerOpen(true) },
    })
  }

  return (
    <article className="group relative min-w-0">
      <Link to={ROUTES.product(product.slug)} className="block" aria-label={product.name}>
        <div className="relative h-[clamp(260px,34vw,440px)] overflow-hidden bg-image max-sm:h-[clamp(240px,72vw,360px)]">
          <ProductImage
            src={product.images[0] ?? ''}
            alt=""
            fallbackColor={product.colors[0]?.hex}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {off > 0 && <Badge variant="accent">-{off}%</Badge>}
            {soldOut && <Badge variant="muted">Esgotado</Badge>}
          </div>
        </div>
      </Link>

      <div className="px-px pt-3.5">
        <h3 className="mb-1 text-[13px] leading-snug font-semibold">
          <Link to={ROUTES.product(product.slug)} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mb-2.5 text-xs text-muted-foreground">{product.subtitle}</p>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} className="mb-3" />
        <div className="flex min-h-8 items-center justify-between">
          <ul className="flex gap-1.5" aria-label="Cores disponíveis">
            {product.colors.map((color) => (
              <li
                key={color.name}
                title={color.name}
                className="size-[13px] rounded-full border border-[#bcbab3]"
                style={{ background: color.hex }}
              >
                <span className="sr-only">{color.name}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={quickAdd}
            disabled={soldOut}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className="grid h-9 w-10 place-items-center rounded-sm border border-input transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-40"
          >
            <ShoppingBag className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  )
})

import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { Seo } from '@/components/common/Seo'
import { CartLineItem } from '@/components/ecommerce/CartLineItem'
import { CouponForm } from '@/components/ecommerce/CouponForm'
import { FreeShippingProgress } from '@/components/ecommerce/FreeShippingProgress'
import { OrderSummary } from '@/components/ecommerce/OrderSummary'
import { ShippingEstimator } from '@/components/ecommerce/ShippingEstimator'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useCartTotals } from '@/hooks/use-cart-totals'
import { useCartStore } from '@/stores/cart.store'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const clear = useCartStore((s) => s.clear)
  const totals = useCartTotals()

  return (
    <div className="container-store py-10">
      <Seo title="Carrinho" path={ROUTES.cart} noIndex />
      <p className="eyebrow">SUA SELEÇÃO</p>
      <h1 className="mb-8 text-[clamp(28px,3.2vw,39px)] font-medium tracking-[-1.5px]">Carrinho</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          description="Explore a coleção e encontre peças que combinam com você."
          action={
            <Button asChild>
              <Link to={ROUTES.products}>VER PRODUTOS →</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <section aria-label="Itens">
            <ul className="border-t border-border">
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} />
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <Button asChild variant="link">
                <Link to={ROUTES.products}>← Continuar comprando</Link>
              </Button>
              <Button variant="link" onClick={clear} className="text-muted-foreground">
                Esvaziar carrinho
              </Button>
            </div>
          </section>

          <aside
            className="h-max space-y-4 rounded-sm bg-soft p-6 lg:sticky lg:top-28"
            aria-label="Resumo do pedido"
          >
            <h2 className="text-sm font-bold">Resumo do pedido</h2>
            <FreeShippingProgress subtotal={totals.subtotal} />
            <CouponForm />
            <ShippingEstimator subtotal={totals.subtotal} />
            <OrderSummary totals={totals} shippingLabel={null} couponCode={coupon?.code} />
            <Button asChild className="w-full">
              <Link to={ROUTES.checkout}>FINALIZAR COMPRA →</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Desconto do Pix aplicado na etapa de pagamento.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

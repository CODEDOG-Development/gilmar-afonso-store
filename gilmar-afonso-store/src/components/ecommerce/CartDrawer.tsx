import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { ROUTES } from '@/constants'
import { useCartTotals } from '@/hooks/use-cart-totals'
import { useCartStore } from '@/stores/cart.store'
import { CartLineItem } from './CartLineItem'
import { FreeShippingProgress } from './FreeShippingProgress'
import { OrderSummary } from './OrderSummary'

/** Carrinho lateral (aside.cart-drawer do original), agora acessível e animado. */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen)
  const setOpen = useCartStore((s) => s.setDrawerOpen)
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const totals = useCartTotals()
  const close = () => setOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent aria-describedby={undefined}>
        <div className="border-b border-border pb-4">
          <SheetDescription>Sua seleção</SheetDescription>
          <SheetTitle>Carrinho</SheetTitle>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center">
            <EmptyState
              icon={ShoppingBag}
              title="Seu carrinho está vazio"
              description="Escolha seus produtos favoritos."
              action={
                <Button asChild variant="outline" onClick={close}>
                  <Link to={ROUTES.products}>VER PRODUTOS</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="pt-4">
              <FreeShippingProgress subtotal={totals.subtotal} />
            </div>
            <ul className="-mr-2 flex-1 overflow-y-auto pr-2" aria-label="Itens do carrinho">
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} onNavigate={close} />
              ))}
            </ul>
            <div className="space-y-3 border-t border-border pt-4">
              <OrderSummary totals={totals} shippingLabel={null} couponCode={coupon?.code} />
              <Button asChild className="w-full" onClick={close}>
                <Link to={ROUTES.checkout}>IR PARA O CHECKOUT →</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={close}>
                <Link to={ROUTES.cart}>VER CARRINHO COMPLETO</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

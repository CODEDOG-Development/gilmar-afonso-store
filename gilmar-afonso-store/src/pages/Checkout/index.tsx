import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { ProductImage } from '@/components/common/ProductImage'
import { Seo } from '@/components/common/Seo'
import { CouponForm } from '@/components/ecommerce/CouponForm'
import { OrderSummary } from '@/components/ecommerce/OrderSummary'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useSaveAddress } from '@/hooks/use-addresses'
import { useCartTotals } from '@/hooks/use-cart-totals'
import { useCreateOrder, useShippingOptions } from '@/hooks/use-checkout'
import { getErrorMessage } from '@/services/api'
import { activeGateway } from '@/services/payments'
import { useAuthStore, useIsAuthenticated } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import { formatMoney, onlyDigits } from '@/utils/format'
import { checkoutDefaults, checkoutSchema, type CheckoutFormValues } from './checkout-schema'
import { AddressSection } from './sections/AddressSection'
import { ContactSection } from './sections/ContactSection'
import { PaymentSection } from './sections/PaymentSection'
import { ShippingSection } from './sections/ShippingSection'

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const clearCart = useCartStore((s) => s.clear)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const saveAddress = useSaveAddress()
  const [isProcessing, setProcessing] = useState(false)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaults,
    mode: 'onTouched', // valida ao sair do campo, não a cada tecla
  })
  const { control, handleSubmit, reset, getValues } = form

  // Cliente logado: preenche os dados de contato
  useEffect(() => {
    if (user) reset({ ...getValues(), name: user.name, email: user.email, phone: user.phone })
  }, [user, reset, getValues])

  const [cep, shippingOptionId, paymentMethod] = useWatch({
    control,
    name: ['cep', 'shippingOptionId', 'paymentMethod'],
  })
  const baseTotals = useCartTotals()
  const shippingQuery = useShippingOptions(cep, baseTotals.subtotal)
  const shipping = shippingQuery.data?.find((o) => o.id === shippingOptionId)
  const totals = useCartTotals({ shipping: shipping?.price ?? 0, paymentMethod })
  const cardTotals = useCartTotals({ shipping: shipping?.price ?? 0, paymentMethod: 'card' })

  async function onSubmit(values: CheckoutFormValues) {
    setProcessing(true)
    try {
      // 1. Cartão: tokeniza no navegador pelo SDK do gateway
      const paymentToken =
        values.paymentMethod === 'card'
          ? await activeGateway.tokenizeCard({
              holderName: values.cardName,
              number: onlyDigits(values.cardNumber),
              expiry: values.cardExpiry,
              cvv: values.cardCvv,
              installments: Number(values.installments),
            })
          : undefined

      // 2. Envia o pedido. O servidor recalcula preços, frete e descontos.
      const address = {
        recipient: values.name,
        cep: onlyDigits(values.cep),
        street: values.street,
        number: values.number,
        complement: values.complement,
        district: values.district,
        city: values.city,
        state: values.state,
      }
      const order = await createOrder.mutateAsync({
        customer: { name: values.name, email: values.email, phone: values.phone },
        items: items.map(({ productId, color, size, quantity }) => ({
          productId,
          color,
          size,
          quantity,
        })),
        address,
        shippingOptionId: values.shippingOptionId,
        paymentMethod: values.paymentMethod,
        installments: values.paymentMethod === 'card' ? Number(values.installments) : undefined,
        couponCode: coupon?.code,
        paymentToken,
      })

      // 3. Salva o endereço na conta (não bloqueia a compra se falhar)
      if (isAuthenticated && values.saveAddress) {
        saveAddress.mutate({ ...address, label: 'Endereço de entrega', isDefault: true })
      }

      navigate(ROUTES.orderSuccess(order.id), { replace: true })
      clearCart()
    } catch (error) {
      toast.error('Não foi possível finalizar o pedido', { description: getErrorMessage(error) })
    } finally {
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-store py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          description="Adicione produtos antes de finalizar a compra."
          action={
            <Button asChild>
              <Link to={ROUTES.products}>VER PRODUTOS →</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-store py-8">
      <Seo title="Checkout" path={ROUTES.checkout} noIndex />
      <p className="eyebrow">FINALIZE SUA COMPRA</p>
      <h1 className="mb-6 text-3xl font-medium tracking-tight">Checkout</h1>

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]"
        >
          <div className="space-y-4">
            <ContactSection />
            <AddressSection />
            <ShippingSection
              options={shippingQuery.data}
              isLoading={shippingQuery.isFetching}
              error={shippingQuery.error}
            />
            <PaymentSection cardTotal={cardTotals.total} />
          </div>

          <aside
            className="h-max space-y-4 rounded-sm bg-background p-6 lg:sticky lg:top-6"
            aria-label="Resumo do pedido"
          >
            <h2 className="text-sm font-bold">Resumo do pedido</h2>
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-3 py-3">
                  <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm">
                    <ProductImage src={item.image} alt="" />
                    <span className="absolute -top-0 -right-0 grid size-5 place-items-center rounded-full bg-foreground text-[10px] text-background">
                      {item.quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.color} · {item.size}
                    </span>
                  </span>
                  <strong className="text-xs">{formatMoney(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            <CouponForm />
            <OrderSummary
              totals={totals}
              shippingLabel={shipping?.name ?? null}
              couponCode={coupon?.code}
              pendingShippingText="Informe o CEP"
            />
            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'PROCESSANDO…' : 'CONFIRMAR PEDIDO →'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Ao confirmar, você concorda com os termos de compra da loja.
            </p>
          </aside>
        </form>
      </FormProvider>
    </div>
  )
}

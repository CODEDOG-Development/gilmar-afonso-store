import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageLoader } from '@/components/common/PageLoader'
import { Seo } from '@/components/common/Seo'
import { OrderSummary } from '@/components/ecommerce/OrderSummary'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useOrder } from '@/hooks/use-checkout'
import type { OrderStatus, PaymentMethod } from '@/types'
import { formatMoney, maskCep } from '@/utils/format'
import NotFoundPage from '../NotFound'

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Aguardando pagamento',
  paid: 'Pagamento aprovado',
  preparing: 'Em separação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  pix: 'Pix',
  card: 'Cartão de crédito',
  boleto: 'Boleto',
}

export default function OrderSuccessPage() {
  const { id = '' } = useParams()
  const { data: order, isLoading, isError } = useOrder(id)

  if (isLoading) return <PageLoader />
  if (isError || !order) return <NotFoundPage />

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('Copiado!')
  }
  const paymentCode = order.payment.pixCode ?? order.payment.boletoLine

  return (
    <div className="container-store max-w-3xl py-12">
      <Seo title="Pedido confirmado" noIndex />
      <div className="rounded-sm bg-background p-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mx-auto mb-5 grid size-16 place-items-center rounded-full border border-accent text-accent-foreground"
        >
          <Check className="size-8" aria-hidden />
        </motion.div>
        <p className="eyebrow">PEDIDO REGISTRADO</p>
        <h1 className="text-3xl font-medium tracking-tight">
          Obrigado pela compra, {order.customer.name.split(' ')[0]}!
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Pedido <strong className="text-foreground">#{order.number}</strong> ·{' '}
          {STATUS_LABEL[order.status]}. Enviamos a confirmação para {order.customer.email}.
        </p>

        {paymentCode && (
          <div className="mx-auto mt-6 max-w-lg rounded-sm bg-soft p-4 text-left">
            <p className="mb-2 text-xs font-semibold">
              {order.paymentMethod === 'pix' ? 'Pix copia e cola' : 'Linha digitável do boleto'} —
              pague {formatMoney(order.totals.total)}
            </p>
            <div className="flex gap-2">
              <code className="min-w-0 flex-1 truncate rounded-sm bg-background px-3 py-2 text-xs">
                {paymentCode}
              </code>
              <Button size="sm" variant="outline" onClick={() => copy(paymentCode)}>
                <Copy /> Copiar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-sm bg-background p-6">
          <h2 className="mb-3 text-sm font-bold">Entrega</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {order.address.street}, {order.address.number}
            {order.address.complement && ` — ${order.address.complement}`}
            <br />
            {order.address.district}, {order.address.city}/{order.address.state}
            <br />
            CEP {maskCep(order.address.cep)}
          </p>
          <p className="mt-3 text-sm">
            {order.shipping.name} · até {order.shipping.days} dias úteis
          </p>
          <h2 className="mt-5 mb-1 text-sm font-bold">Pagamento</h2>
          <p className="text-sm text-muted-foreground">
            {PAYMENT_LABEL[order.paymentMethod]}
            {order.payment.installments &&
              order.payment.installments > 1 &&
              ` em ${order.payment.installments}x`}
          </p>
        </section>
        <section className="rounded-sm bg-background p-6">
          <h2 className="mb-3 text-sm font-bold">Itens</h2>
          <ul className="mb-4 space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {item.quantity}× {item.name} ({item.color}, {item.size})
                </span>
                <span>{formatMoney(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary
            totals={order.totals}
            shippingLabel={order.shipping.name}
            couponCode={order.couponCode}
          />
        </section>
      </div>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Button asChild>
          <Link to={ROUTES.products}>CONTINUAR COMPRANDO</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={ROUTES.home}>VOLTAR AO INÍCIO</Link>
        </Button>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Protótipo: nenhuma cobrança foi realizada. Integre o gateway em src/services/payments para
        vender de verdade.
      </p>
    </div>
  )
}

import { Barcode, CreditCard, QrCode, type LucideIcon } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { MAX_INSTALLMENTS, PIX_DISCOUNT } from '@/constants'
import { activeGateway } from '@/services/payments'
import type { PaymentMethod } from '@/types'
import { cn } from '@/utils/cn'
import { formatMoney, maskCardNumber, maskExpiry, onlyDigits } from '@/utils/format'
import { installmentValue } from '@/utils/pricing'
import type { CheckoutFormValues } from '../checkout-schema'
import { StepTitle } from './StepTitle'

const METHODS: { id: PaymentMethod; label: string; description: string; icon: LucideIcon }[] = [
  {
    id: 'pix',
    label: 'Pix',
    description: `${PIX_DISCOUNT * 100}% de desconto · aprovação imediata`,
    icon: QrCode,
  },
  {
    id: 'card',
    label: 'Cartão de crédito',
    description: `Em até ${MAX_INSTALLMENTS}x sem juros`,
    icon: CreditCard,
  },
  {
    id: 'boleto',
    label: 'Boleto bancário',
    description: 'Compensação em até 2 dias úteis',
    icon: Barcode,
  },
]

/** Total sem o desconto do Pix — base do parcelamento no cartão. */
export function PaymentSection({ cardTotal }: { cardTotal: number }) {
  const { register, setValue, control, formState } = useFormContext<CheckoutFormValues>()
  const { errors } = formState
  const method = useWatch({ control, name: 'paymentMethod' })
  const available = METHODS.filter((m) => activeGateway.methods.includes(m.id))

  return (
    <section className="rounded-sm bg-background p-6">
      <StepTitle step={4} title="Pagamento" />
      <fieldset className="grid gap-2">
        <legend className="sr-only">Forma de pagamento</legend>
        {available.map(({ id, label, description, icon: Icon }) => (
          <label
            key={id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition-colors',
              method === id ? 'border-foreground' : 'border-input hover:border-ring',
            )}
          >
            <input
              type="radio"
              value={id}
              className="accent-foreground"
              {...register('paymentMethod')}
            />
            <Icon className="size-5 text-muted-foreground" aria-hidden />
            <span>
              <strong className="block text-sm">{label}</strong>
              <span className="text-xs text-muted-foreground">{description}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {method === 'card' && (
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <FormField
            label="Nome impresso no cartão"
            autoComplete="cc-name"
            className="sm:col-span-4"
            error={errors.cardName?.message}
            {...register('cardName')}
          />
          <FormField
            label="Número do cartão"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            className="sm:col-span-4"
            error={errors.cardNumber?.message}
            {...register('cardNumber', {
              onChange: (e) => setValue('cardNumber', maskCardNumber(e.target.value)),
            })}
          />
          <FormField
            label="Validade"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            className="sm:col-span-2"
            error={errors.cardExpiry?.message}
            {...register('cardExpiry', {
              onChange: (e) => setValue('cardExpiry', maskExpiry(e.target.value)),
            })}
          />
          <FormField
            label="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            className="sm:col-span-2"
            error={errors.cardCvv?.message}
            {...register('cardCvv', {
              onChange: (e) => setValue('cardCvv', onlyDigits(e.target.value)),
            })}
          />
          <div className="space-y-2 sm:col-span-4">
            <Label htmlFor="installments">Parcelas</Label>
            <NativeSelect id="installments" className="h-11" {...register('installments')}>
              {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}x de {formatMoney(installmentValue(cardTotal, n))} sem juros
                </option>
              ))}
            </NativeSelect>
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-4">
            Protótipo: não use dados reais. Em produção, estes campos são substituídos pelo
            formulário seguro do {activeGateway.label} e o número do cartão nunca chega ao nosso
            servidor.
          </p>
        </div>
      )}
    </section>
  )
}

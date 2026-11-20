import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/services/api'
import type { ShippingOption } from '@/types'
import { cn } from '@/utils/cn'
import { formatMoney, onlyDigits } from '@/utils/format'
import type { CheckoutFormValues } from '../checkout-schema'
import { StepTitle } from './StepTitle'

interface ShippingSectionProps {
  options?: ShippingOption[]
  isLoading: boolean
  error: unknown
}

export function ShippingSection({ options, isLoading, error }: ShippingSectionProps) {
  const { register, setValue, control, formState } = useFormContext<CheckoutFormValues>()
  const cep = useWatch({ control, name: 'cep' })
  const selected = useWatch({ control, name: 'shippingOptionId' })

  // Quando chegam novas opções, pré-seleciona a primeira (a mais barata) se a atual sumiu
  useEffect(() => {
    if (options?.length && !options.some((o) => o.id === selected)) {
      setValue('shippingOptionId', options[0]!.id, { shouldValidate: true })
    }
  }, [options, selected, setValue])

  return (
    <section className="rounded-sm bg-background p-6">
      <StepTitle step={3} title="Frete" />
      {onlyDigits(cep).length !== 8 && (
        <p className="text-sm text-muted-foreground">
          Informe o CEP para ver as opções de entrega.
        </p>
      )}
      {isLoading && <Skeleton className="h-28" />}
      {Boolean(error) && (
        <p role="alert" className="text-sm text-destructive">
          {getErrorMessage(error)}
        </p>
      )}
      {options && (
        <fieldset className="grid gap-2">
          <legend className="sr-only">Opções de frete</legend>
          {options.map((option) => (
            <label
              key={option.id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition-colors',
                selected === option.id ? 'border-foreground' : 'border-input hover:border-ring',
              )}
            >
              <input
                type="radio"
                value={option.id}
                className="accent-foreground"
                {...register('shippingOptionId')}
              />
              <span className="flex-1">
                <strong className="block text-sm">{option.name}</strong>
                <span className="text-xs text-muted-foreground">Até {option.days} dias úteis</span>
              </span>
              <strong className={cn('text-sm', option.price === 0 && 'text-success')}>
                {option.price === 0 ? 'Grátis' : formatMoney(option.price)}
              </strong>
            </label>
          ))}
        </fieldset>
      )}
      {formState.errors.shippingOptionId && (
        <p className="mt-2 text-xs text-destructive">{formState.errors.shippingOptionId.message}</p>
      )}
    </section>
  )
}

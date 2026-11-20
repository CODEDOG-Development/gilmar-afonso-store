import { Truck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useShippingQuote } from '@/hooks/use-checkout'
import { getErrorMessage } from '@/services/api'
import { formatMoney, maskCep } from '@/utils/format'

/** "Calcule o frete" da página de produto. */
export function ShippingEstimator({ subtotal }: { subtotal: number }) {
  const [cep, setCep] = useState('')
  const quote = useShippingQuote()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    quote.mutate({ cep, subtotal })
  }

  return (
    <div className="rounded-sm border border-border p-4">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="shipping-cep"
          className="mb-2 flex items-center gap-2 text-xs font-semibold"
        >
          <Truck className="size-4" aria-hidden /> Calcule o frete e o prazo
        </label>
        <div className="flex gap-2">
          <Input
            id="shipping-cep"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => setCep(maskCep(e.target.value))}
            className="h-10"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={cep.length < 9 || quote.isPending}
          >
            {quote.isPending ? 'Calculando…' : 'Calcular'}
          </Button>
        </div>
      </form>
      {quote.isError && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {getErrorMessage(quote.error)}
        </p>
      )}
      {quote.data && (
        <ul className="mt-3 space-y-1.5 text-xs" aria-live="polite">
          {quote.data.map((option) => (
            <li key={option.id} className="flex justify-between">
              <span>
                {option.name} · até {option.days} dias úteis
              </span>
              <strong>{option.price === 0 ? 'Grátis' : formatMoney(option.price)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

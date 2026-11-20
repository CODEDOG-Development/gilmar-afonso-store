import { Tag, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApplyCoupon } from '@/hooks/use-checkout'
import { getErrorMessage } from '@/services/api'
import { useCartStore } from '@/stores/cart.store'

export function CouponForm() {
  const [code, setCode] = useState('')
  const coupon = useCartStore((s) => s.coupon)
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const mutation = useApplyCoupon()

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-sm border border-dashed border-success/50 bg-success/5 px-3 py-2 text-sm">
        <span className="flex items-center gap-2">
          <Tag className="size-4 text-success" aria-hidden />
          <strong>{coupon.code}</strong> · {coupon.description}
        </span>
        <button
          type="button"
          onClick={() => applyCoupon(null)}
          aria-label="Remover cupom"
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (code.trim()) mutation.mutate(code)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Cupom de desconto"
          aria-label="Cupom de desconto"
          className="h-10"
        />
        <Button type="submit" variant="outline" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? 'Validando…' : 'Aplicar'}
        </Button>
      </div>
      {mutation.isError && (
        <p role="alert" className="text-xs text-destructive">
          {getErrorMessage(mutation.error)}
        </p>
      )}
    </form>
  )
}

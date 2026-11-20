import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/** Caixa de mensagem de formulário (erro do servidor ou confirmação). */
export function FormAlert({
  variant = 'error',
  children,
}: {
  variant?: 'error' | 'success'
  children: ReactNode
}) {
  const Icon = variant === 'error' ? AlertCircle : CheckCircle2
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-2.5 rounded-sm border p-3 text-sm',
        variant === 'error'
          ? 'border-destructive/30 bg-destructive/5 text-destructive'
          : 'border-success/30 bg-success/5 text-success',
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}

import { useId, type ComponentProps, type ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'

interface FormFieldProps extends ComponentProps<'input'> {
  label: string
  error?: string
  hint?: ReactNode
}

/**
 * Rótulo + campo + mensagem de erro já ligados para acessibilidade:
 * aria-invalid marca o campo e aria-describedby faz o leitor de tela ler o erro.
 */
export function FormField({ label, error, hint, className, id, ...props }: FormFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      />
      {error ? (
        <p id={messageId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

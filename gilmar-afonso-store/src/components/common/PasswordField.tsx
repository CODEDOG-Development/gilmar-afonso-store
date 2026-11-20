import { Eye, EyeOff } from 'lucide-react'
import { useId, useState, type ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'

interface PasswordFieldProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string
  error?: string
  hint?: string
}

/** Campo de senha com botão "mostrar/ocultar" — reduz erros de digitação no celular. */
export function PasswordField({ label, error, hint, className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  const messageId = `${id}-message`
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className="pr-11"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {(error || hint) && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

/** Variantes reproduzem os botões do projeto original (.btn-gold, .btn-outline, .btn-small). */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-3 rounded-sm border border-transparent text-xs font-bold tracking-wide whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        outline: 'border-input bg-transparent text-foreground hover:border-foreground',
        ghost: 'bg-transparent hover:bg-muted',
        link: 'h-auto px-0 font-normal underline underline-offset-4 hover:text-accent-foreground',
        destructive: 'bg-destructive text-white hover:opacity-90',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-14 px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Quando true, aplica o estilo ao filho (ex.: <Link>) em vez de renderizar <button>. */
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

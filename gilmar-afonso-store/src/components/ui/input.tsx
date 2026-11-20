import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-sm border border-input bg-[#faf9f6] px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-ring disabled:opacity-50 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

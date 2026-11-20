import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Junta classes do Tailwind resolvendo conflitos.
 * Ex.: cn('px-2', isLarge && 'px-6') → 'px-6' (o último vence, sem duplicar).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

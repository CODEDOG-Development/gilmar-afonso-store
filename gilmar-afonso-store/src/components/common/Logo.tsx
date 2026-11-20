import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

/** Marca "≋ GILMAR AFONSO / COMPANY STORE" idêntica à do projeto original. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to={ROUTES.home}
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="Gilmar Afonso — página inicial"
    >
      <span
        aria-hidden
        className="-rotate-[25deg] font-display text-[34px] leading-[0.8] md:text-[39px]"
      >
        ≋
      </span>
      <span className="flex flex-col gap-[3px]">
        <strong className="text-[11px] font-bold tracking-[1.2px] md:text-[13px]">
          GILMAR AFONSO
        </strong>
        <small className="text-center text-[7px] tracking-[2px] text-muted-foreground">
          COMPANY STORE
        </small>
      </span>
    </Link>
  )
}

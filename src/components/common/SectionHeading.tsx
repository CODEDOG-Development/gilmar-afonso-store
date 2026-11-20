import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  /** Conteúdo à direita do título (ex.: link "Ver todos →"). */
  action?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-7 flex items-end justify-between gap-4', className)}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <Tag className="text-[clamp(28px,3.2vw,39px)] leading-[1.15] font-medium tracking-[-1.5px]">
          {title}
        </Tag>
      </div>
      {action}
    </div>
  )
}

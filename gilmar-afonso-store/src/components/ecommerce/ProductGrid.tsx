import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types'
import { cn } from '@/utils/cn'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  skeletonCount?: number
  className?: string
}

export function ProductGrid({
  products,
  isLoading,
  skeletonCount = 4,
  className,
}: ProductGridProps) {
  const gridClass = cn(
    'grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4',
    className,
  )

  if (isLoading) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Carregando produtos">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[clamp(240px,34vw,440px)]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="Nenhum produto encontrado"
        description="Tente outros termos ou limpe os filtros."
      />
    )
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

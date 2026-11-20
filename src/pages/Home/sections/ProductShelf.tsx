import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ProductGrid } from '@/components/ecommerce/ProductGrid'
import { useProducts } from '@/hooks/use-products'
import type { ProductFilters } from '@/types'
import { cn } from '@/utils/cn'

interface ProductShelfProps {
  eyebrow: string
  title: string
  filters: ProductFilters
  /** Link "Ver todos" (com os mesmos filtros na listagem). */
  seeAllHref: string
  tone?: 'light' | 'soft'
}

/** "Vitrine" reutilizável da Home: destaques, mais vendidos e promoções usam o mesmo componente. */
export function ProductShelf({
  eyebrow,
  title,
  filters,
  seeAllHref,
  tone = 'light',
}: ProductShelfProps) {
  const { data, isLoading } = useProducts({ perPage: 4, ...filters })
  return (
    <section className={cn('py-10 md:py-14', tone === 'soft' && 'bg-soft')}>
      <div className="container-store">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          action={
            <Link
              to={seeAllHref}
              className="mb-2 text-xs whitespace-nowrap underline underline-offset-4 hover:text-accent-foreground"
            >
              Ver todos →
            </Link>
          }
        />
        <Reveal>
          <ProductGrid products={data?.data} isLoading={isLoading} />
        </Reveal>
      </div>
    </section>
  )
}

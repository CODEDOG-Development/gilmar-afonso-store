import { BadgeCheck } from 'lucide-react'
import { Rating } from '@/components/common/Rating'
import { Skeleton } from '@/components/ui/skeleton'
import { useProductReviews } from '@/hooks/use-products'
import type { Product } from '@/types'
import { formatDate } from '@/utils/format'

export function ProductReviews({ product }: { product: Product }) {
  const { data: reviews, isLoading } = useProductReviews(product.slug)

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div>
        <p className="text-5xl font-medium">{product.rating.toLocaleString('pt-BR')}</p>
        <Rating value={product.rating} size="md" className="my-2" />
        <p className="text-sm text-muted-foreground">{product.reviewCount} avaliações</p>
      </div>
      <ul className="space-y-6">
        {isLoading && Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-24" />)}
        {reviews?.map((review) => (
          <li key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <Rating value={review.rating} />
              <strong className="text-sm">{review.title}</strong>
            </div>
            <p className="text-sm leading-relaxed text-[#3d3c37]">{review.comment}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              {review.author} · {formatDate(review.createdAt)}
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-success">
                  <BadgeCheck className="size-3.5" aria-hidden /> Compra verificada
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

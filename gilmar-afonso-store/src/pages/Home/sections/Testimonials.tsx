import { Quote } from 'lucide-react'
import { Rating } from '@/components/common/Rating'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Skeleton } from '@/components/ui/skeleton'
import { useTestimonials } from '@/hooks/use-products'

export function Testimonials() {
  const { data, isLoading } = useTestimonials()
  return (
    <section className="container-store py-12 md:py-16">
      <SectionHeading eyebrow="DEPOIMENTOS" title="Quem veste, recomenda" />
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading && Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-48" />)}
        {data?.map((t, index) => (
          <Reveal key={t.id} delay={index * 0.08}>
            <figure className="flex h-full flex-col rounded-sm border border-border p-6">
              <Quote className="mb-4 size-6 text-accent" aria-hidden />
              <blockquote className="flex-1 text-sm leading-relaxed text-[#3d3c37]">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <span>
                  <strong className="block text-sm font-semibold">{t.author}</strong>
                  <span className="text-xs text-muted-foreground">{t.city}</span>
                </span>
                <Rating value={t.rating} />
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

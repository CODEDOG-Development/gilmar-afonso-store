import { Seo } from '@/components/common/Seo'
import { ROUTES } from '@/constants'
import { Benefits } from './sections/Benefits'
import { BrandStory } from './sections/BrandStory'
import { Categories } from './sections/Categories'
import { Hero } from './sections/Hero'
import { ProductShelf } from './sections/ProductShelf'
import { PromoBanner } from './sections/PromoBanner'
import { Testimonials } from './sections/Testimonials'

/** A Home só organiza as seções; cada seção cuida dos próprios dados. */
export default function HomePage() {
  return (
    <>
      <Seo path={ROUTES.home} />
      <Hero />
      <Benefits />
      <Categories />
      <ProductShelf
        tone="soft"
        eyebrow="PRODUTOS EM DESTAQUE"
        title="Escolhidos para você"
        filters={{ sort: 'relevance' }}
        seeAllHref={ROUTES.products}
      />
      <ProductShelf
        eyebrow="MAIS VENDIDOS"
        title="Os favoritos dos clientes"
        filters={{ sort: 'best-sellers' }}
        seeAllHref={`${ROUTES.products}?ordem=best-sellers`}
      />
      <PromoBanner />
      <ProductShelf
        tone="soft"
        eyebrow="PROMOÇÕES"
        title="Preços especiais"
        filters={{ onSale: true, sort: 'price-asc' }}
        seeAllHref={`${ROUTES.products}?promocao=1`}
      />
      <BrandStory />
      <Testimonials />
    </>
  )
}

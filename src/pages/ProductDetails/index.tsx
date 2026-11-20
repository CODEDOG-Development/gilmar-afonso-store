import { Check, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Price } from '@/components/common/Price'
import { Rating } from '@/components/common/Rating'
import { Seo } from '@/components/common/Seo'
import { ProductGallery } from '@/components/ecommerce/ProductGallery'
import { ProductGrid } from '@/components/ecommerce/ProductGrid'
import { QuantitySelector } from '@/components/ecommerce/QuantitySelector'
import { ShippingEstimator } from '@/components/ecommerce/ShippingEstimator'
import { ColorSelector, SizeSelector } from '@/components/ecommerce/VariantSelectors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/constants'
import { env } from '@/constants/env'
import { useCategories, useProduct, useRelatedProducts } from '@/hooks/use-products'
import { useCartStore } from '@/stores/cart.store'
import type { Product } from '@/types'
import { discountPercent } from '@/utils/format'
import NotFoundPage from '../NotFound'
import { ProductReviews } from './ProductReviews'

export default function ProductDetailsPage() {
  const { slug = '' } = useParams()
  const { data: product, isLoading, isError } = useProduct(slug)

  if (isLoading) return <ProductSkeleton />
  if (isError || !product) return <NotFoundPage />
  // key={slug}: ao navegar para um produto relacionado, cor/tamanho escolhidos são reiniciados
  return <ProductView key={slug} product={product} />
}

function ProductView({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? '')
  const [size, setSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen)
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const { data: related, isLoading: relatedLoading } = useRelatedProducts(product.slug)

  const category = categories?.find((c) => c.slug === product.categorySlug)
  const soldOut = product.stock === 0
  const off = discountPercent(product.price, product.compareAtPrice)
  const colorHex = product.colors.find((c) => c.name === color)?.hex

  function addToCart(goToCheckout = false) {
    if (!size) {
      setSizeError(true)
      return
    }
    addItem({ product, color, size, quantity })
    if (goToCheckout) return navigate(ROUTES.checkout)
    toast.success('Adicionado ao carrinho', { description: `${product.name} · ${color} · ${size}` })
    setDrawerOpen(true)
  }

  return (
    <div className="container-store py-8">
      <Seo
        title={product.name}
        description={product.description}
        path={ROUTES.product(product.slug)}
        image={product.images[0]}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images.map((src) => new URL(src, env.siteUrl).href),
          brand: { '@type': 'Brand', name: product.brand },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            price: product.price,
            availability: soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          },
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'Início', to: ROUTES.home },
          {
            label: category?.name ?? 'Produtos',
            to: category ? ROUTES.category(category.slug) : ROUTES.products,
          },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ProductGallery images={product.images} name={product.name} fallbackColor={colorHex} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{product.brand}</p>
          <h1 className="text-[clamp(26px,3vw,36px)] leading-tight font-medium tracking-tight">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.subtitle}</p>
          <a href="#avaliacoes" className="mt-3 inline-block">
            <Rating value={product.rating} count={product.reviewCount} />
          </a>

          <div className="my-6 flex items-start gap-3">
            <Price
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              variant="detailed"
            />
            {off > 0 && <Badge variant="accent">-{off}%</Badge>}
          </div>

          <div className="space-y-6">
            <ColorSelector colors={product.colors} value={color} onChange={setColor} />
            <SizeSelector
              sizes={product.sizes}
              value={size}
              error={sizeError}
              onChange={(value) => {
                setSize(value)
                setSizeError(false)
              }}
            />

            {soldOut ? (
              <div className="rounded-sm bg-muted p-4 text-sm">
                <strong>Produto esgotado.</strong> Em breve teremos novidades.
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <QuantitySelector
                    value={quantity}
                    max={product.stock}
                    onChange={(q) => setQuantity(Math.max(1, q))}
                    label={product.name}
                    size="md"
                  />
                  <p className="flex items-center gap-1.5 text-xs text-success">
                    <Check className="size-4" aria-hidden />
                    {product.stock <= 10 ? `Últimas ${product.stock} unidades` : 'Em estoque'}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button size="lg" onClick={() => addToCart()}>
                    <ShoppingBag /> ADICIONAR AO CARRINHO
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => addToCart(true)}>
                    COMPRAR AGORA
                  </Button>
                </div>
              </>
            )}

            <ShippingEstimator subtotal={product.price * quantity} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="descricao" className="mt-16" id="avaliacoes">
        <TabsList>
          <TabsTrigger value="descricao">Descrição</TabsTrigger>
          <TabsTrigger value="especificacoes">Especificações</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações ({product.reviewCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="descricao">
          <p className="max-w-2xl text-sm leading-[1.8] text-[#3d3c37]">{product.description}</p>
        </TabsContent>
        <TabsContent value="especificacoes">
          <dl className="max-w-2xl divide-y divide-border border-y border-border text-sm">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[140px_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
        <TabsContent value="avaliacoes">
          <ProductReviews product={product} />
        </TabsContent>
      </Tabs>

      <section className="mt-16" aria-labelledby="relacionados">
        <p className="eyebrow">VOCÊ TAMBÉM PODE GOSTAR</p>
        <h2
          id="relacionados"
          className="mb-7 text-[clamp(24px,2.6vw,32px)] font-medium tracking-tight"
        >
          Produtos relacionados
        </h2>
        <ProductGrid products={related} isLoading={relatedLoading} />
      </section>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="container-store grid gap-10 py-8 lg:grid-cols-[1.15fr_1fr]" aria-busy="true">
      <Skeleton className="aspect-[4/5]" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

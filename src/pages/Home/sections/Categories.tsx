import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ProductImage'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ROUTES } from '@/constants'

/** Os mesmos 4 cartões do original. "Ver coleção" leva à listagem completa. */
const CARDS = [
  {
    label: 'CAMISETAS',
    to: ROUTES.category('camisetas'),
    image: 'camiseta-cinza.jpeg',
    color: '#8a8a88',
  },
  { label: 'POLOS', to: ROUTES.category('polos'), image: 'polo-bordo.jpeg', color: '#6b1f2a' },
  {
    label: 'CAMISAS SOCIAIS',
    to: ROUTES.category('camisas-sociais'),
    image: 'camisa-social-branca.jpeg',
    color: '#f4f3ef',
  },
  {
    label: 'VER COLEÇÃO',
    to: ROUTES.products,
    image: 'camiseta-verde-militar.jpeg',
    color: '#4b5340',
  },
]

export function Categories() {
  return (
    <section className="container-store py-10 md:py-14" aria-labelledby="categorias-titulo">
      <SectionHeading eyebrow="NOSSAS CATEGORIAS" title="Escolha o seu estilo" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-4">
        {CARDS.map((card, index) => (
          <Reveal key={card.label} delay={index * 0.06}>
            <Link to={card.to} className="group block">
              <div className="h-[clamp(230px,65vw,330px)] overflow-hidden bg-image md:h-[clamp(250px,27vw,390px)]">
                <ProductImage
                  src={`/images/products/${card.image}`}
                  alt=""
                  fallbackColor={card.color}
                  className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <span className="flex items-center justify-between pt-3 text-[11px] font-semibold tracking-[0.4px]">
                {card.label}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

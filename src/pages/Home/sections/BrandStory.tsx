import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ProductImage'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

/** Seção institucional (".brand-story" do original). */
export function BrandStory() {
  return (
    <section className="grid bg-image md:min-h-[380px] md:grid-cols-[1.08fr_0.92fr]">
      <div className="h-[340px] md:h-auto md:min-h-[380px]">
        <ProductImage
          src="/images/products/camisa-social-preta.jpeg"
          alt="Detalhe de camisa social preta premium"
          fallbackColor="#171715"
        />
      </div>
      <Reveal className="self-center px-[6%] py-10 md:px-[10%] md:py-12">
        <p className="eyebrow">QUALIDADE EM CADA DETALHE</p>
        <h2 className="mb-5 text-[clamp(32px,3.5vw,46px)] leading-[1.08] font-medium tracking-[-1.8px]">
          Peças que
          <br />
          representam
          <br />
          quem você é
        </h2>
        <p className="mb-6 max-w-[330px] text-[13px] leading-[1.75] text-[#5e5c55]">
          Design moderno, materiais de alta qualidade e acabamento premium.
        </p>
        <Button asChild>
          <Link to={ROUTES.about}>
            CONHEÇA NOSSA HISTÓRIA <ArrowRight />
          </Link>
        </Button>
      </Reveal>
    </section>
  )
}

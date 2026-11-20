import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

export function PromoBanner() {
  return (
    <section className="bg-foreground text-background">
      <Reveal className="container-store flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div>
          <p className="mb-3 text-[11px] tracking-eyebrow text-accent">PRIMEIRA COMPRA</p>
          <h2 className="text-[clamp(26px,3vw,38px)] leading-tight font-medium tracking-tight">
            10% off com o cupom <span className="font-display text-accent italic">BEMVINDO10</span>
          </h2>
          <p className="mt-2 text-sm text-[#c9c7bf]">
            Válido para todo o site. Acumula com o desconto do Pix.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-background text-background hover:bg-background hover:text-foreground"
        >
          <Link to={`${ROUTES.products}?promocao=1`}>VER PROMOÇÕES →</Link>
        </Button>
      </Reveal>
    </section>
  )
}

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/common/ProductImage'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

/** Banner principal — mesma composição do original: texto à esquerda, foto inteira à direita. */
export function Hero() {
  return (
    <section className="relative flex min-h-[650px] items-end overflow-hidden bg-[#f2f0eb] px-[6%] pt-[320px] pb-8 md:h-[min(42vw,560px)] md:min-h-[480px] md:items-center md:px-[7%] md:py-0">
      <div className="absolute inset-0 md:left-[43%]">
        <ProductImage
          src="/images/products/polo-preta.jpeg"
          alt="Modelo vestindo polo preta premium"
          loading="eager"
          fetchPriority="high"
          fallbackColor="#171715"
          className="bg-[#e7e5df] object-top max-md:h-[370px] md:object-right"
        />
      </div>
      {/* Degradê que garante leitura do texto sobre a foto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(0deg,#f2f0eb_0%,#f2f0eb_38%,rgba(242,240,235,0.78)_49%,rgba(242,240,235,0.05)_70%,transparent_100%)] md:bg-[linear-gradient(90deg,#f2f0eb_0%,rgba(242,240,235,0.98)_29%,rgba(242,240,235,0.76)_43%,rgba(242,240,235,0.05)_65%,transparent_100%)]"
      />
      <motion.div
        className="relative z-[2] w-full md:w-[min(48%,540px)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">ESTILO QUE IMPRESSIONA</p>
        <h1 className="mb-5 text-[clamp(32px,9vw,43px)] leading-[1.03] font-semibold tracking-[-1.6px] md:text-[clamp(34px,4vw,54px)] md:tracking-[-2px]">
          VESTUÁRIO
          <br />
          DE QUALIDADE
          <br />
          <span className="font-normal text-[#6e6c65]">PARA O SEU DIA A DIA</span>
        </h1>
        <p className="mb-6 max-w-[320px] text-[13px] leading-[1.8] text-[#5f5d56]">
          Camisas, moletons e peças exclusivas com conforto, design e durabilidade.
        </p>
        <Button asChild>
          <Link to={ROUTES.products}>
            VER PRODUTOS <ArrowRight />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}

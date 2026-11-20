import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { PageLoader } from '@/components/common/PageLoader'
import { ProductImage } from '@/components/common/ProductImage'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'

/** Telas de login/cadastro: formulário à esquerda e foto da marca à direita. */
export function AuthLayout() {
  useScrollToTop()
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px]">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <div className="relative hidden bg-image lg:block">
        <ProductImage
          src="/images/products/camisa-social-preta.jpeg"
          alt=""
          loading="eager"
          fallbackColor="#171715"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-12 text-white">
          <p className="text-[11px] tracking-eyebrow">ÁREA DO CLIENTE</p>
          <p className="mt-2 text-3xl font-medium tracking-tight">
            Peças que representam quem você é.
          </p>
        </div>
      </div>
    </div>
  )
}

import { Lock } from 'lucide-react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { PageLoader } from '@/components/common/PageLoader'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'

/** Checkout sem menu nem rodapé completo: menos distrações = mais conversão. */
export function CheckoutLayout() {
  useScrollToTop()
  return (
    <div className="min-h-dvh bg-soft">
      <header className="border-b border-border bg-background">
        <div className="container-store flex h-[70px] items-center justify-between">
          <Logo />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-4" aria-hidden /> Compra 100% segura
          </p>
        </div>
      </header>
      <main id="conteudo">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

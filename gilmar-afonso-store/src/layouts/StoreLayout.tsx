import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageLoader'
import { CartDrawer } from '@/components/ecommerce/CartDrawer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'

/** Moldura da loja: cabeçalho, conteúdo da página (Outlet), rodapé e carrinho lateral. */
export function StoreLayout() {
  useScrollToTop()
  return (
    <>
      {/* Link "pular para o conteúdo": aparece ao apertar Tab (WCAG 2.4.1) */}
      <a
        href="#conteudo"
        className="sr-only z-50 bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      <AnnouncementBar />
      <Header />
      <main id="conteudo" className="min-h-[60vh]">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}

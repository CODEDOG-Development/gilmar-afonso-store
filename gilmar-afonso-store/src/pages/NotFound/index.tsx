import { Link } from 'react-router-dom'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

export default function NotFoundPage() {
  return (
    <div className="container-store flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <Seo title="Página não encontrada" noIndex />
      <p className="font-display text-7xl text-accent">404</p>
      <h1 className="mt-4 text-2xl font-medium tracking-tight">Não encontramos esta página</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        O link pode ter mudado ou o produto saiu do catálogo.
      </p>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link to={ROUTES.products}>VER PRODUTOS</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={ROUTES.home}>INÍCIO</Link>
        </Button>
      </div>
    </div>
  )
}

import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'

/** Tela exibida se uma página quebrar (erro inesperado), em vez de tela branca. */
export function RouteError() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : 'Algo deu errado ao carregar esta página.'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="eyebrow">GILMAR AFONSO</p>
      <h1 className="text-2xl font-medium">Ops! {message}</h1>
      <p className="text-sm text-muted-foreground">
        Tente recarregar. Se continuar, fale com a gente.
      </p>
      <Button onClick={() => window.location.assign(import.meta.env.BASE_URL)}>
        VOLTAR AO INÍCIO
      </Button>
    </div>
  )
}

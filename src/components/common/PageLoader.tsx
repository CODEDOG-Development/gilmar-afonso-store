/** Exibido enquanto o código de uma página (lazy) é baixado. */
export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
      <span className="size-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      <span className="sr-only">Carregando…</span>
    </div>
  )
}

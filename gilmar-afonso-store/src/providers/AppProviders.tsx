import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

/** Cache do React Query: 1 min "fresco", 1 nova tentativa em caso de erro. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
})

/** Todos os "provedores" globais num lugar só. O App fica limpo. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* reducedMotion="user": desliga animações se o sistema pedir (acessibilidade) */}
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
      </MotionConfig>
    </QueryClientProvider>
  )
}

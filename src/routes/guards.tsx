import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuthStore, useIsAuthenticated } from '@/stores/auth.store'
import type { UserRole } from '@/types'

/**
 * "Middleware" de autenticação das rotas privadas.
 * Sem sessão válida → manda para /entrar guardando de onde veio (state.from),
 * para voltar à mesma página depois do login.
 */
export function PrivateRoute({ role }: { role?: UserRole }) {
  const isAuthenticated = useIsAuthenticated()
  const userRole = useAuthStore((s) => s.user?.role)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname + location.search }} />
    )
  }
  if (role && userRole !== role) return <Navigate to={ROUTES.home} replace />
  return <Outlet />
}

/** Rotas só para visitantes (login, cadastro): quem já entrou vai para a conta. */
export function GuestRoute() {
  const isAuthenticated = useIsAuthenticated()
  return isAuthenticated ? <Navigate to={ROUTES.account} replace /> : <Outlet />
}

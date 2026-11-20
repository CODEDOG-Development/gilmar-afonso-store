import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ROUTES } from '@/constants'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Hooks de autenticação. As páginas só chamam `login.mutate(dados)`;
 * salvar a sessão, avisar o usuário e redirecionar fica concentrado aqui.
 */
export function useLogin(redirectTo: string = ROUTES.home) {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      setSession(session)
      toast.success(`Olá, ${session.user.name.split(' ')[0]}!`)
      navigate(redirectTo, { replace: true })
    },
  })
}

export function useRegister(redirectTo: string = ROUTES.home) {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (session) => {
      setSession(session)
      toast.success('Conta criada com sucesso!')
      navigate(redirectTo, { replace: true })
    },
  })
}

export const useForgotPassword = () => useMutation({ mutationFn: authService.forgotPassword })

export function useResetPassword() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Senha redefinida. Entre com a nova senha.')
      navigate(ROUTES.login, { replace: true })
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  return () => {
    logout()
    toast('Você saiu da sua conta.')
    navigate(ROUTES.home)
  }
}

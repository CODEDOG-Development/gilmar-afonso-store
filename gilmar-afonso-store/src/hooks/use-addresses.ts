import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { useIsAuthenticated } from '@/stores/auth.store'

const KEY = ['me', 'addresses'] as const

/** Endereços salvos. Só consulta se houver sessão (visitante não tem endereços). */
export function useAddresses() {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({ queryKey: KEY, queryFn: userService.addresses, enabled: isAuthenticated })
}

export function useSaveAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.saveAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { FormAlert } from '@/components/common/FormAlert'
import { PasswordField } from '@/components/common/PasswordField'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useResetPassword } from '@/hooks/use-auth'
import { getErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'

const schema = z
  .object({ password: rules.password, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    error: 'As senhas não coincidem.',
  })

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const reset = useResetPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), mode: 'onTouched' })

  return (
    <>
      <Seo title="Nova senha" noIndex />
      <p className="eyebrow">RECUPERAR ACESSO</p>
      <h1 className="mb-8 text-3xl font-medium tracking-tight">Crie uma nova senha</h1>

      {!token ? (
        <FormAlert>
          Link inválido.{' '}
          <Link to={ROUTES.forgotPassword} className="underline">
            Solicite um novo
          </Link>
          .
        </FormAlert>
      ) : (
        <form
          onSubmit={handleSubmit(({ password }) => reset.mutate({ token, password }))}
          noValidate
          className="space-y-4"
        >
          {reset.isError && <FormAlert>{getErrorMessage(reset.error)}</FormAlert>}
          <PasswordField
            label="Nova senha"
            autoComplete="new-password"
            hint="Mínimo de 8 caracteres, com letras e números."
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordField
            label="Confirme a nova senha"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" className="w-full" disabled={reset.isPending}>
            {reset.isPending ? 'SALVANDO…' : 'SALVAR NOVA SENHA'}
          </Button>
        </form>
      )}
    </>
  )
}

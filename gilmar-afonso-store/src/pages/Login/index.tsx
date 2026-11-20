import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { Divider } from '@/components/common/Divider'
import { FormAlert } from '@/components/common/FormAlert'
import { FormField } from '@/components/common/FormField'
import { GoogleButton } from '@/components/common/GoogleButton'
import { PasswordField } from '@/components/common/PasswordField'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useLogin } from '@/hooks/use-auth'
import { getErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'

const schema = z.object({
  email: rules.email,
  password: z.string().min(1, { error: 'Digite sua senha.' }),
})
type LoginForm = z.infer<typeof schema>

export default function LoginPage() {
  const location = useLocation()
  // Se veio de uma rota privada (ou do checkout), volta para lá depois do login
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.account
  const login = useLogin(from)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema), mode: 'onTouched' })

  return (
    <>
      <Seo title="Entrar" path={ROUTES.login} noIndex />
      <p className="eyebrow">ÁREA DO CLIENTE</p>
      <h1 className="text-3xl font-medium tracking-tight">Bem-vindo de volta</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">Entre para acompanhar seus pedidos.</p>

      <form
        onSubmit={handleSubmit((values) => login.mutate(values))}
        noValidate
        className="space-y-4"
      >
        {login.isError && <FormAlert>{getErrorMessage(login.error)}</FormAlert>}
        <FormField
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          label="Senha"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="text-right">
          <Link to={ROUTES.forgotPassword} className="text-xs underline underline-offset-4">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'ENTRANDO…' : 'ENTRAR'}
        </Button>
      </form>

      <Divider />
      <GoogleButton />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link
          to={ROUTES.register}
          state={location.state}
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Criar conta
        </Link>
      </p>
    </>
  )
}

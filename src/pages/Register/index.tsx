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
import { useRegister } from '@/hooks/use-auth'
import { getErrorMessage } from '@/services/api'
import { maskPhone } from '@/utils/format'
import { rules } from '@/utils/validation'

const schema = z
  .object({
    name: rules.name,
    email: rules.email,
    phone: rules.phone,
    password: rules.password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'As senhas não coincidem.',
  })
type RegisterForm = z.infer<typeof schema>

export default function RegisterPage() {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.account
  const registerUser = useRegister(from)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema), mode: 'onTouched' })

  return (
    <>
      <Seo title="Criar conta" path={ROUTES.register} noIndex />
      <p className="eyebrow">ÁREA DO CLIENTE</p>
      <h1 className="text-3xl font-medium tracking-tight">Crie sua conta</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Cadastre-se para agilizar suas compras.
      </p>

      <form
        onSubmit={handleSubmit(({ confirmPassword: _confirm, ...values }) =>
          registerUser.mutate(values),
        )}
        noValidate
        className="space-y-4"
      >
        {registerUser.isError && <FormAlert>{getErrorMessage(registerUser.error)}</FormAlert>}
        <FormField
          label="Nome completo"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <FormField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          label="Celular"
          type="tel"
          autoComplete="tel"
          placeholder="(31) 99999-0000"
          error={errors.phone?.message}
          {...register('phone', { onChange: (e) => setValue('phone', maskPhone(e.target.value)) })}
        />
        <PasswordField
          label="Senha"
          autoComplete="new-password"
          hint="Mínimo de 8 caracteres, com letras e números."
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordField
          label="Confirme a senha"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" className="w-full" disabled={registerUser.isPending}>
          {registerUser.isPending ? 'CRIANDO CONTA…' : 'CRIAR CONTA'}
        </Button>
      </form>

      <Divider />
      <GoogleButton />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link
          to={ROUTES.login}
          state={location.state}
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>
    </>
  )
}

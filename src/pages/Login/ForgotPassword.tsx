import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { FormAlert } from '@/components/common/FormAlert'
import { FormField } from '@/components/common/FormField'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'
import { useForgotPassword } from '@/hooks/use-auth'
import { getErrorMessage } from '@/services/api'
import { rules } from '@/utils/validation'

const schema = z.object({ email: rules.email })

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

  return (
    <>
      <Seo title="Recuperar senha" path={ROUTES.forgotPassword} noIndex />
      <p className="eyebrow">RECUPERAR ACESSO</p>
      <h1 className="text-3xl font-medium tracking-tight">Esqueceu a senha?</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Informe seu e-mail e enviaremos um link para criar uma nova senha.
      </p>

      {forgot.isSuccess ? (
        <div className="space-y-4">
          <FormAlert variant="success">{forgot.data.message}</FormAlert>
          {/* Só existe na simulação: no backend real, o link chega por e-mail */}
          {forgot.data.devResetToken && (
            <p className="rounded-sm bg-soft p-3 text-xs">
              Simulação:{' '}
              <Link
                to={`${ROUTES.resetPassword}?token=${forgot.data.devResetToken}`}
                className="font-semibold underline underline-offset-4"
              >
                abrir o link de redefinição
              </Link>
            </p>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(({ email }) => forgot.mutate(email))}
          noValidate
          className="space-y-4"
        >
          {forgot.isError && <FormAlert>{getErrorMessage(forgot.error)}</FormAlert>}
          <FormField
            label="E-mail"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" className="w-full" disabled={forgot.isPending}>
            {forgot.isPending ? 'ENVIANDO…' : 'ENVIAR LINK'}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm">
        <Link to={ROUTES.login} className="underline underline-offset-4">
          ← Voltar para o login
        </Link>
      </p>
    </>
  )
}

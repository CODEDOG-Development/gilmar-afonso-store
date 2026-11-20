export type UserRole = 'customer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  createdAt: string
}

export interface Address {
  id: string
  label: string
  recipient: string
  cep: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  isDefault: boolean
}

export interface AuthSession {
  user: User
  accessToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

import { lazy } from 'react'
import { createBrowserRouter, createHashRouter, type RouteObject } from 'react-router-dom'
import { env } from '@/constants/env'
import { AuthLayout } from '@/layouts/AuthLayout'
import { CheckoutLayout } from '@/layouts/CheckoutLayout'
import { StoreLayout } from '@/layouts/StoreLayout'
import { RouteError } from '@/pages/RouteError'
import { GuestRoute, PrivateRoute } from './guards'

/*
 * Code splitting: cada página vira um arquivo .js separado e só é baixada
 * quando o cliente visita a rota. A Home fica mais leve no primeiro acesso.
 */
const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderSuccess = lazy(() => import('@/pages/Checkout/OrderSuccess'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const ForgotPassword = lazy(() => import('@/pages/Login/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/Login/ResetPassword'))
const Profile = lazy(() => import('@/pages/Profile'))
const About = lazy(() => import('@/pages/About'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const routes: RouteObject[] = [
  {
    element: <StoreLayout />,
    errorElement: <RouteError />,
    children: [
      // Rotas públicas
      { index: true, element: <Home /> },
      { path: 'produtos', element: <Products /> },
      { path: 'produto/:slug', element: <ProductDetails /> },
      { path: 'carrinho', element: <Cart /> },
      { path: 'sobre', element: <About /> },
      // Rotas privadas
      {
        element: <PrivateRoute />,
        children: [{ path: 'conta', element: <Profile /> }],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <CheckoutLayout />,
    errorElement: <RouteError />,
    children: [
      { path: 'checkout', element: <Checkout /> },
      { path: 'pedido/:id/sucesso', element: <OrderSuccess /> },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: 'entrar', element: <Login /> },
          { path: 'cadastro', element: <Register /> },
        ],
      },
      { path: 'recuperar-senha', element: <ForgotPassword /> },
      { path: 'redefinir-senha', element: <ResetPassword /> },
    ],
  },
]

/**
 * "browser" gera URLs limpas (/produto/polo-classica-bordo) — padrão para produção.
 * "hash" (/#/produto/...) serve só para hospedagens sem reescrita de rotas.
 */
/** "/gilmar-afonso-store/" → "/gilmar-afonso-store" (o React Router não quer a barra final). */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router =
  env.routerMode === 'hash' ? createHashRouter(routes) : createBrowserRouter(routes, { basename })

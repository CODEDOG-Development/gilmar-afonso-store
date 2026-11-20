# Gilmar Afonso Company Store

E-commerce em **React 19 + TypeScript + Vite**, migrado do protótipo em HTML/CSS/JS.
A identidade visual original foi preservada: cores, tipografia DM Sans + Playfair Display, layout e enquadramento das fotos.

> **Fase 1 entregue:** a base do projeto e a loja completa (Home, catálogo, produto, carrinho, checkout, autenticação e página institucional).
> Os dados vêm de uma **API simulada** que roda no navegador, por isso tudo funciona sem backend.

## Como rodar

```bash
npm install
cp .env.example .env      # no Windows: copy .env.example .env
npm run dev               # http://localhost:5173
```

| Script              | O que faz                                             |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento com recarga instantânea   |
| `npm run build`     | Gera o sitemap, checa os tipos e cria a pasta `dist/` |
| `npm run preview`   | Abre o build de produção para conferir                |
| `npm run lint`      | ESLint                                                |
| `npm run format`    | Prettier (formata todos os arquivos)                  |
| `npm run typecheck` | Só a checagem do TypeScript                           |

## Testar a loja

- **Cupons:** `BEMVINDO10` (10%) e `GA15` (15%)
- **Frete grátis** no PAC acima de R$ 299,00. **Pix** tem 5% de desconto.
- **Cartão (simulação):** qualquer número de 16 dígitos e validade futura. Não use dados reais.
- **Conta:** crie em `/cadastro`. Os dados ficam só no seu navegador (localStorage `ga_mock_db_v1`).
- **Recuperar senha:** a simulação mostra o link na tela. No backend real, o link vai por e-mail.
- **Fotos:** copie as imagens do projeto antigo para `public/images/products/` (veja o `LEIA-ME.txt` nessa pasta).
  Enquanto uma foto não existir, aparece uma silhueta na cor do produto.

## Tecnologias

React 19 · TypeScript (strict) · Vite · React Router 7 · Tailwind CSS 4 · shadcn/ui (Radix) ·
TanStack Query 5 · Zustand 5 · Axios · React Hook Form + Zod · Framer Motion · Sonner

## Estrutura

```
src/
├── components/
│   ├── ui/          componentes base no padrão shadcn/ui (Button, Input, Sheet...)
│   ├── common/      peças genéricas (Seo, Price, Rating, FormField...)
│   ├── ecommerce/   peças da loja (ProductCard, CartDrawer, ProductGallery...)
│   └── layout/      Header, Footer, SearchBar
├── pages/           uma pasta por página (Home, Products, ProductDetails, Cart, Checkout...)
├── layouts/         molduras: StoreLayout, CheckoutLayout, AuthLayout
├── routes/          rotas (lazy) + guards PrivateRoute / GuestRoute
├── services/        Axios, serviços por domínio, payments/ e mock/ (API simulada)
├── stores/          Zustand: carrinho e sessão
├── hooks/           hooks do React Query e utilitários
├── types/           tipos TypeScript do domínio
├── utils/           formatação, preços, JWT, validações
├── constants/       regras da loja, rotas, chaves de cache, env
├── providers/       QueryClient, MotionConfig, Toaster
└── contexts/        reservado (o estado global usa Zustand)
```

## Rotas

| Rota                                  | Página                       | Acesso        |
| ------------------------------------- | ---------------------------- | ------------- |
| `/`                                   | Home                         | pública       |
| `/produtos`                           | Listagem com filtros         | pública       |
| `/produto/:slug`                      | Página do produto            | pública       |
| `/carrinho`                           | Carrinho                     | pública       |
| `/checkout`                           | Checkout                     | pública       |
| `/pedido/:id/sucesso`                 | Confirmação                  | pública       |
| `/sobre`                              | Institucional, FAQ e contato | pública       |
| `/entrar` `/cadastro`                 | Login e cadastro             | só visitantes |
| `/recuperar-senha` `/redefinir-senha` | Recuperação                  | pública       |
| `/conta`                              | Área do cliente              | **privada**   |

## Ligar no backend real (NestJS + PostgreSQL)

1. Implemente no backend os endpoints listados em `docs/GUIA.md` → Fase 9, com o mesmo formato de resposta.
2. No `.env`: `VITE_USE_MOCK_API=false` e `VITE_API_URL=https://api.seudominio.com.br`.
3. Pronto: nenhuma tela muda. O código da simulação nem entra no build.

## Publicar

`npm run build` gera a pasta `dist/`. Envie o **conteúdo** dela para a hospedagem.

- **Apache/FTP (cPanel, Hostinger...):** o `.htaccess` já vai junto e faz as rotas funcionarem.
- **GitHub Pages (demonstração):** o workflow `.github/workflows/deploy.yml` publica a cada push na `main`. Requer repositório público (no plano gratuito) e _Settings → Pages → Source: GitHub Actions_. Endereço: `https://<usuario>.github.io/gilmar-afonso-store/`.
- **Netlify:** `public/_redirects` já está pronto. **Vercel:** `vercel.json` já está pronto.

## Próximas fases

- **Fase 2 — Área do cliente:** editar dados, alterar senha, CRUD de endereços, histórico e status de pedidos, favoritos, avaliações, login com Google.
- **Fase 3 — Painel administrativo:** dashboard de vendas, CRUD de produtos (com upload) e categorias, gestão de pedidos e de usuários e permissões.

---

Guia de estudo, arquivo por arquivo: **[docs/GUIA.md](docs/GUIA.md)**

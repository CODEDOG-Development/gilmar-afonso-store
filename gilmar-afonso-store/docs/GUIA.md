# Guia de estudo — Gilmar Afonso Store (Fase 1)

Este guia mostra **como o projeto foi montado, na ordem certa para você redigitar**.
Cada fase tem começo, meio e fim. Ao final de cada uma existe um **✅ Ponto de checagem** para você ter certeza de que está tudo funcionando antes de seguir.

Para cada arquivo você encontra:

- **📄 Caminho:** onde o arquivo fica.
- **Para que serve:** o papel do arquivo no sistema.
- **Linha por linha:** os trechos importantes e o **porquê** de cada um.

> Dica: abra o arquivo pronto ao lado (projeto do zip) e digite o seu em outra pasta.
> Os comentários dentro do código também explicam as decisões. Leia-os enquanto digita.

---

## Sumário

0. [Conceitos antes de começar](#fase-0--conceitos-antes-de-começar)
1. [Criar o projeto e configurar as ferramentas](#fase-1--criar-o-projeto-e-configurar-as-ferramentas)
2. [Tipos, constantes e utilitários](#fase-2--tipos-constantes-e-utilitários)
3. [Componentes base (shadcn/ui)](#fase-3--componentes-base-shadcnui)
4. [Camada de dados: API simulada, Axios, stores e hooks](#fase-4--camada-de-dados)
5. [Componentes compartilhados](#fase-5--componentes-compartilhados)
6. [Layouts, rotas e ponto de entrada](#fase-6--layouts-rotas-e-ponto-de-entrada)
7. [Páginas](#fase-7--páginas)
8. [SEO, build e publicação](#fase-8--seo-build-e-publicação)
9. [Trocar a simulação pelo backend NestJS](#fase-9--trocar-a-simulação-pelo-backend-nestjs)

---

## Fase 0 — Conceitos antes de começar

### O que mudou em relação ao projeto antigo

| Projeto antigo (`app.js`)                            | Projeto novo                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| Um arquivo com tudo: dados, HTML em string, eventos  | Cada responsabilidade numa pasta (componentes, serviços, stores...) |
| `innerHTML = ...` para desenhar a tela               | Componentes React: a tela é uma função dos dados                    |
| `document.addEventListener("click")` com `closest()` | Cada botão tem o seu `onClick`                                      |
| `localStorage` lido e escrito à mão                  | Zustand com `persist`: salva sozinho                                |
| Uma página só com modais                             | Rotas de verdade (`/produto/polo-classica-bordo`), boas para SEO    |
| Senha salva em texto puro no navegador               | Fluxo de autenticação com JWT, pronto para o backend                |

### Os dois tipos de estado (o conceito mais importante do projeto)

1. **Estado do servidor:** produtos, categorias, pedidos. Quem manda nele é o backend. O front só guarda uma cópia.
   → Fica com o **TanStack Query** (React Query), que cuida de cache, carregamento, erro e nova tentativa.
2. **Estado do cliente:** carrinho, sessão, gaveta aberta ou fechada. Quem manda nele é o navegador.
   → Fica com o **Zustand**, uma store global simples.

Misturar os dois (por exemplo, guardar a lista de produtos no Zustand) é o erro mais comum em React. Aqui eles ficam separados desde o início.

### Como os dados fluem

```
Página  →  hook (useProducts)  →  service (productService.list)  →  api (Axios)  →  mock adapter OU backend real
  ↑                                                                                         │
  └────────────────────────── React Query guarda em cache e devolve ────────────────────────┘
```

A página nunca chama o Axios diretamente. Por isso, trocar a simulação pelo backend real não muda nenhuma tela.

---

## Fase 1 — Criar o projeto e configurar as ferramentas

**Começo:** uma pasta vazia. **Fim:** um projeto Vite que abre no navegador com o Tailwind funcionando.

### 1.1 Criar e instalar

No terminal, numa pasta nova:

```bash
npm init -y
npm i react@19 react-dom@19 react-router-dom@7 @tanstack/react-query@5 zustand@5 axios framer-motion react-hook-form zod @hookform/resolvers clsx tailwind-merge class-variance-authority lucide-react radix-ui sonner tw-animate-css
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node tailwindcss @tailwindcss/vite eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals prettier prettier-plugin-tailwindcss
```

**Por que cada pacote:**

| Pacote                                               | Função                                                |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `react-router-dom`                                   | Rotas (páginas com URL própria)                       |
| `@tanstack/react-query`                              | Cache e carregamento dos dados da API                 |
| `zustand`                                            | Estado global (carrinho e sessão)                     |
| `axios`                                              | Requisições HTTP com interceptadores                  |
| `react-hook-form` + `zod` + `@hookform/resolvers`    | Formulários rápidos com validação tipada              |
| `radix-ui`                                           | Componentes acessíveis sem estilo (base do shadcn/ui) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variantes de componentes e junção de classes          |
| `framer-motion`                                      | Animações suaves                                      |
| `lucide-react`                                       | Ícones                                                |
| `sonner`                                             | Notificações (toasts)                                 |
| `tw-animate-css`                                     | Animações de entrada e saída da gaveta e dos modais   |

### 1.2 `package.json` → scripts

📄 `package.json`

Adicione `"type": "module"` (permite `import` nos arquivos de configuração) e os scripts:

```json
"scripts": {
  "dev": "vite",
  "prebuild": "node scripts/generate-sitemap.mjs",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write .",
  "typecheck": "tsc -b --noEmit"
}
```

- `build` roda primeiro o `tsc -b`. **Se houver erro de tipo, o build para**: nada quebrado vai para produção.
- `prebuild` roda sozinho antes do `build` (convenção do npm). Ele gera o sitemap (Fase 8).

### 1.3 TypeScript

📄 `tsconfig.json`: só aponta para os outros dois (`references`). O código do app e o arquivo de configuração do Vite rodam em ambientes diferentes (navegador e Node), então cada um tem a sua configuração.

📄 `tsconfig.app.json`: as linhas que importam:

- `"strict": true` liga todas as checagens rígidas. É o "TypeScript estrito" pedido no escopo.
- `"noUncheckedIndexedAccess": true` faz `lista[0]` ter o tipo `Produto | undefined`. Isso obriga você a tratar o caso da lista vazia. É por isso que o código tem tantos `?? ''`.
- `"noUnusedLocals"` e `"noUnusedParameters"`: variável esquecida vira erro.
- `"verbatimModuleSyntax": true` obriga a escrever `import type { X }` quando só o tipo é importado. Assim o tipo some do JavaScript final.
- `"paths": { "@/*": ["./src/*"] }` permite escrever `@/components/ui/button` em vez de `../../../components/ui/button`.

📄 `tsconfig.node.json`: a mesma ideia, só para o `vite.config.ts`.

📄 `src/vite-env.d.ts`: declara as variáveis `VITE_*` do `.env`. Sem isso, `import.meta.env.VITE_API_URL` não teria tipo.

### 1.4 Vite

📄 `vite.config.ts`

- `plugins: [react(), tailwindcss()]`: o plugin do React (JSX e recarga instantânea) e o do Tailwind 4, que dispensa `tailwind.config.js` e `postcss.config.js`.
- `resolve.alias`: o mesmo `@/` do tsconfig. **Os dois precisam existir**: o tsconfig ensina o editor e o Vite ensina o empacotador.
- `manualChunks`: separa React, Framer Motion e as bibliotecas de dados em arquivos próprios. Quando você atualiza uma página, o navegador do cliente continua com o React em cache.

### 1.5 Qualidade de código

📄 `eslint.config.js`: formato "flat config" (ESLint 9 em diante).

- `reactHooks.configs.recommended.rules` pega erros com hooks, como chamar `useState` dentro de um `if`.
- `consistent-type-imports` exige `import type`.
- `argsIgnorePattern: '^_'`: um parâmetro que começa com `_` pode ficar sem uso. Útil para descartar campos, como em `({ confirmPassword: _confirm, ...values })`.
- O último bloco desliga uma regra para `components/ui` e `routes`, porque esses arquivos exportam outras coisas além de componentes.

📄 `.prettierrc`: sem ponto e vírgula, aspas simples, linhas de até 100 caracteres. O plugin do Tailwind **ordena as classes** automaticamente.

📄 `.vscode/settings.json`: formata ao salvar e corrige o ESLint ao salvar. Instale as extensões recomendadas quando o VS Code pedir.

📄 `components.json`: configuração do shadcn/ui. Ela permite rodar depois `npx shadcn add <componente>` para trazer novos componentes já no padrão do projeto.

### 1.6 Ambiente

📄 `.env.example` → copie para `.env`

```
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_API=true
VITE_SITE_URL=https://www.gilmarafonso.com.br
```

Só as variáveis que começam com `VITE_` chegam ao navegador. **Nunca coloque segredos aqui** (chave secreta do Stripe, senha de banco): tudo no front é público.

📄 `src/constants/env.ts`: lê essas variáveis uma única vez e aplica valores padrão. O resto do código importa `env.useMockApi` em vez de espalhar `import.meta.env` pelo projeto.

### 1.7 HTML e estilos globais

📄 `index.html`: `lang="pt-BR"` (o leitor de tela pronuncia em português), meta tags padrão de SEO e Open Graph, e as fontes do Google. A única tag no corpo é `<div id="root">`: o React desenha tudo ali dentro.

📄 `src/index.css`: o coração da identidade visual.

- `@import 'tailwindcss'` liga o Tailwind 4.
- O bloco `:root { ... }` traz as cores do `styles.css` original, com os nomes do shadcn (`--primary`, `--muted-foreground`...). Assim, todo componente shadcn já nasce com as cores da marca.
- `--muted-foreground` passou de `#77756f` para `#66645d`. A cor antiga não tinha contraste suficiente sobre o fundo `#f5f4f0` (WCAG AA exige 4,5:1).
- `@theme inline { ... }` transforma as variáveis em classes do Tailwind: `--color-soft` vira `bg-soft`, `text-soft` etc.
- `:focus-visible` desenha um contorno ao navegar pelo Tab (acessibilidade). Ele não aparece no clique do mouse.
- `prefers-reduced-motion` desliga as animações para quem pediu isso no sistema operacional.
- `.eyebrow` e `.container-store` são os únicos estilos "nomeados": são repetidos em quase toda tela.

### ✅ Ponto de checagem da Fase 1

Crie temporariamente `src/main.tsx` com:

```tsx
import { createRoot } from 'react-dom/client'
import './index.css'
createRoot(document.getElementById('root')!).render(<h1 className="eyebrow">funcionou</h1>)
```

Rode `npm run dev`. Se aparecer "FUNCIONOU" pequeno, espaçado e cinza, o Tailwind e as cores estão certos.

---

## Fase 2 — Tipos, constantes e utilitários

**Começo:** projeto vazio configurado. **Fim:** as "regras do negócio" escritas e testáveis, sem nenhuma tela ainda.

> Por que começar pelos tipos? Porque eles são o **contrato** do sistema. Depois que `Product` existe, o editor avisa se qualquer tela usar um campo errado.

### 2.1 Tipos

📄 `src/types/product.ts`

- `slug`: o nome amigável que vai na URL (`polo-classica-bordo`). URL amigável é um requisito de SEO.
- `compareAtPrice?`: o preço "de" riscado. O `?` diz que é opcional: só existe quando o produto está em promoção.
- `ProductFilters`: tudo opcional, porque cada filtro só é aplicado se vier preenchido.
- `Paginated<T>`: tipo **genérico**. `Paginated<Product>` é uma página de produtos. No futuro, `Paginated<Order>` será uma página de pedidos, sem reescrever nada.

📄 `src/types/cart.ts`: o `CartItem` guarda uma **cópia** do nome, preço e imagem. Assim o carrinho abre instantaneamente, sem consultar a API. A `key` combina produto, cor e tamanho: a mesma polo em G e em M vira duas linhas.

📄 `src/types/user.ts` e 📄 `src/types/order.ts`: usuário, endereço, sessão e pedido. Repare em `CreateOrderPayload.paymentToken`: **o número do cartão nunca está nos tipos**, só o token. Essa regra de segurança fica gravada no próprio contrato.

📄 `src/types/index.ts`: reexporta tudo. Assim você escreve `import type { Product, CartItem } from '@/types'`.

### 2.2 Constantes

📄 `src/constants/index.ts`

- `STORE`: nome, e-mail, telefone e redes sociais. **Troque aqui** pelos dados reais do cliente.
- `PIX_DISCOUNT = 0.05`, `FREE_SHIPPING_THRESHOLD = 299`: as regras comerciais do `app.js` antigo, agora num lugar só.
- `ROUTES`: todos os caminhos. `ROUTES.product(slug)` é uma função, então nunca existe um link montado à mão com erro de digitação.
- `QUERY_KEYS`: as "etiquetas" do cache do React Query. Ao salvar um endereço, por exemplo, o código invalida `['me', 'addresses']` e a lista recarrega sozinha.
- `as const` congela os valores. O TypeScript passa a saber o texto exato, não só que é uma `string`.

### 2.3 Utilitários

📄 `src/utils/cn.ts`: `cn('px-2', ativo && 'px-6')` resolve os conflitos do Tailwind (o último vence). É usado em todos os componentes.

📄 `src/utils/format.ts`

- `formatMoney` usa `Intl.NumberFormat` criado **uma vez fora da função**: criar o formatador custa caro, e ele é chamado centenas de vezes.
- `maskCep`, `maskPhone`, `maskCardNumber`, `maskExpiry`: máscaras aplicadas enquanto o usuário digita. Todas seguem a mesma receita: tirar o que não é dígito, cortar no tamanho máximo e inserir os separadores.
- `slugify` usa `normalize('NFD')` e remove os acentos: "Bordô" vira "bordo".

📄 `src/utils/pricing.ts`: **a função mais importante do projeto**.
`calculateTotals` é a única fonte de verdade dos valores. O carrinho lateral, a página do carrinho, o checkout e até a API simulada chamam a mesma função. No `app.js` antigo, o total era calculado em dois lugares diferentes, e isso costuma gerar divergência.
A ordem é: subtotal → cupom → desconto Pix sobre o valor já com cupom → soma do frete. O `round` evita erros de ponto flutuante (0,1 + 0,2 = 0,30000000000000004).

📄 `src/utils/jwt.ts`: `decodeJwt` lê o conteúdo do token. Um JWT tem três partes separadas por ponto, e a do meio é um JSON em base64. **O front não valida a assinatura** (isso é trabalho do backend). Ele só lê `exp` para saber se a sessão expirou. `isTokenExpired` dá 30 segundos de margem para o token não vencer no meio de uma requisição.

📄 `src/utils/placeholder.ts`: gera um SVG de camiseta na cor do produto, como `data:` URI. Ele cobre as fotos que ainda não foram copiadas.

📄 `src/utils/validation.ts`: as regras do Zod reaproveitadas em todos os formulários. As mensagens dizem **o que fazer** ("Digite o telefone com DDD"), não só que algo está errado.

### ✅ Ponto de checagem da Fase 2

Rode `npx tsc -b`. Nenhum erro = tipos e utilitários consistentes.

---

## Fase 3 — Componentes base (shadcn/ui)

**Começo:** utilitários prontos. **Fim:** a "caixa de peças" visual da loja.

O shadcn/ui **não é uma biblioteca instalada**: os componentes são copiados para dentro do projeto (`src/components/ui`) e passam a ser seus. Por isso eles foram ajustados ao visual da Gilmar Afonso: cantos de 2 px, botão preto e texto em caixa alta.

📄 `src/components/ui/button.tsx`: **estude este primeiro.** O mesmo padrão se repete nos outros.

- `cva(...)` define as **variantes**: `variant` (default, outline, ghost, link) e `size`. Escrever `<Button variant="outline" size="sm">` substitui as classes `.btn .btn-outline .btn-small` do CSS antigo.
- `asChild`: quando é `true`, o botão **empresta o estilo ao filho** em vez de criar um `<button>`. É assim que `<Button asChild><Link to="/produtos">` vira um link com cara de botão, sem botão dentro de link (HTML inválido).
- `ComponentProps<'button'>`: o componente aceita qualquer atributo de `<button>` (`disabled`, `type`, `aria-*`...).

📄 `input.tsx`, `label.tsx`, `badge.tsx`, `skeleton.tsx`, `separator.tsx`: componentes simples, cada um aplicando o estilo da marca.
Em `input.tsx`, a classe `aria-invalid:border-destructive` deixa a borda vermelha sozinha quando o campo tem erro.

📄 `checkbox.tsx`, `radio-group.tsx`, `tabs.tsx`, `accordion.tsx`: componentes do Radix com estilo. O Radix entrega pronto o teclado (setas, espaço, Enter) e os atributos ARIA que o leitor de tela precisa.

📄 `sheet.tsx`: a gaveta lateral. Ela usa o `Dialog` do Radix, que:

1. **prende o foco** dentro da gaveta (o Tab não "foge" para a página de trás);
2. fecha com Esc e com clique fora;
3. devolve o foco ao botão que abriu.

No projeto antigo, nada disso existia. As classes `data-[state=open]:slide-in-from-right` animam a entrada.

📄 `dialog.tsx`: o mesmo princípio, centralizado (usado no zoom da foto).

📄 `native-select.tsx`: `<select>` nativo estilizado. No celular ele abre o seletor do próprio sistema, que é melhor que qualquer seletor personalizado.

### ✅ Ponto de checagem da Fase 3

No `main.tsx` temporário, renderize `<Button>VER PRODUTOS</Button>` e `<Button variant="outline">CONTINUAR</Button>`. Eles devem ficar iguais aos botões do site antigo.

---

## Fase 4 — Camada de dados

**Começo:** componentes visuais. **Fim:** uma "API" que responde no navegador, o Axios configurado, as stores e os hooks.

### 4.1 A API simulada (`src/services/mock/`)

Em vez de espalhar `if (mock)` pelo código, a simulação se encaixa **dentro do Axios** como um adaptador. O resto do app chama `api.get('/products')` e não sabe quem responde.

📄 `mock/data/catalog.ts`: os 8 produtos originais e mais 8 novos (incluindo **Moletons**, citados no banner do site antigo e que não existiam), além de categorias, avaliações, depoimentos e cupons.

- `const img = (file) => ...` monta o caminho da foto num lugar só.
- `type Seed = Omit<Product, 'id' | 'slug' ...>`: o "molde" de cadastro não tem `id` nem `slug`. O `.map` no fim gera os dois automaticamente, o que evita digitar o mesmo dado duas vezes.

📄 `mock/db.ts`: o "banco de dados" da simulação no localStorage (usuários, pedidos, endereços, tokens de redefinição).

- `hashPassword` usa SHA-256 só para a senha não ficar legível. **No backend real, use bcrypt ou argon2.**
- `createMockJwt` monta um token no formato JWT de verdade, com uma assinatura falsa.
- `toPublicUser` remove o `passwordHash` antes de devolver o usuário. **Nunca mande o hash da senha para o front**, nem na simulação.

📄 `mock/http.ts`: `MockHttpError(404, 'Produto não encontrado.')` permite simular erros HTTP reais.

📄 `mock/routes.ts`: cada rota é um trio `[método, caminho, função]`. Ele é o "backend de mentira" e a especificação do backend de verdade (veja a Fase 9). Destaques:

- `GET /products` aplica busca, filtros, ordenação e paginação, nesta ordem. A função `normalize` remove os acentos: buscar "camisa" encontra "Camisa", e "moletom" encontra "Moletom".
- `/products/facets` e `/products/suggestions` vêm **antes** de `/products/:slug`. Se viessem depois, "facets" seria interpretado como o slug de um produto.
- `POST /orders` **recalcula preços a partir do catálogo** e ignora o preço enviado pelo navegador. Qualquer pessoa pode editar o localStorage e mudar o preço do carrinho; o servidor nunca deve confiar nisso.
- `POST /auth/login` responde "E-mail ou senha incorretos" nos dois casos (e-mail inexistente ou senha errada), para não revelar quais e-mails têm conta.
- `/auth/forgot-password` sempre responde igual, pelo mesmo motivo.

📄 `mock/adapter.ts`

- `compiled` transforma `/products/:slug` na expressão regular `^/products/(?<slug>[^/]+)$`. O grupo nomeado vira `params.slug`.
- `await new Promise(... 350)`: uma latência falsa, para você ver os "esqueletos" de carregamento como no mundo real.
- Ao lançar `AxiosError` com `response`, o erro simulado fica **idêntico** a um erro do servidor real. O `getErrorMessage` trata os dois do mesmo jeito.

### 4.2 Axios

📄 `src/services/api.ts`

- `adapter: env.useMockApi ? async (config) => (await import('./mock/adapter'))...`: o `import()` dinâmico faz o código da simulação **não entrar no build** quando `VITE_USE_MOCK_API=false`.
- **Interceptor de requisição:** pega o token na store (`useAuthStore.getState()`, que funciona fora de componentes) e coloca `Authorization: Bearer ...` em toda chamada.
- **Interceptor de resposta:** se o servidor responder 401, encerra a sessão. É aqui que entra o _refresh token_ quando o backend existir.
- `getErrorMessage`: transforma qualquer erro numa frase para o cliente. Sem resposta do servidor = problema de conexão.

### 4.3 Serviços (um por domínio)

📄 `product.service.ts`, `auth.service.ts`, `checkout.service.ts`, `user.service.ts`: funções pequenas que só chamam a API e devolvem `.data` já tipado (`api.get<Product[]>`). Isso aplica o "S" do SOLID: cada arquivo tem um único motivo para mudar.

- `checkoutService.lookupCep` usa a **ViaCEP** (gratuita e real) com `fetch` direto, porque ela não faz parte do nosso backend. Se falhar, devolve `null` e o cliente preenche à mão.
- `authService.loginWithGoogle` já existe e espera o backend.

📄 `services/payments/index.ts`: a interface `PaymentGateway` e três implementações (Mercado Pago, Stripe e PayPal). O checkout só conhece a interface e chama `activeGateway.tokenizeCard(...)`. Trocar de gateway é trocar uma linha (`activeGateway = gateways.stripe`). Esse é o "D" do SOLID (inversão de dependência). Os comentários mostram qual chamada do SDK oficial substitui cada simulação.

### 4.4 Stores (Zustand)

📄 `src/stores/cart.store.ts`

- `create<CartState>()(persist(...))`: o `persist` salva no localStorage com a chave `ga-cart`. É o `saveCart()` do código antigo, automático.
- `addItem`: se a mesma combinação de produto, cor e tamanho já existe, soma a quantidade **sem passar do estoque** (`Math.min`).
- `updateQuantity` com quantidade 0 remove a linha (o mesmo comportamento do botão "−" no site antigo).
- `partialize`: salva só `items` e `coupon`. A gaveta não deve abrir sozinha quando o cliente volta ao site.
- `useCartCount`: um **seletor**. O ícone do carrinho só redesenha quando a contagem muda, não a cada alteração da store.

📄 `src/stores/auth.store.ts`: `user`, `accessToken`, `setSession` e `logout`. `useIsAuthenticated` só considera logado quem tem usuário **e** token não vencido.

### 4.5 Hooks

📄 `use-products.ts`: cada hook é um `useQuery` com a sua chave.

- `placeholderData: keepPreviousData`: ao trocar de página, a grade antiga continua visível até a nova chegar, em vez de piscar em branco.
- `staleTime: 30 * 60_000` em categorias: elas quase não mudam, então ficam 30 minutos sem nova consulta.
- `enabled: q.length >= 2` nas sugestões: com uma letra, nem consulta.

📄 `use-auth.ts`: `useLogin`, `useRegister` etc. são `useMutation` (ações que **alteram** algo). No `onSuccess`, salvam a sessão, mostram o toast e redirecionam. A página só chama `login.mutate(dados)`.

📄 `use-checkout.ts`: cotação de frete, cupom, criação do pedido e consulta de CEP. `useShippingOptions` é uma query que depende de `[cep, subtotal]`: mudou a quantidade no carrinho, o frete recalcula sozinho.

📄 `use-cart-totals.ts`: `useMemo` em volta de `calculateTotals`. O cálculo só é refeito quando itens, cupom, frete ou pagamento mudam. Este é o "memoização quando necessário" do escopo.

📄 `use-debounce.ts`: espera o usuário parar de digitar (250 ms) antes de buscar.

📄 `use-addresses.ts`: só consulta se houver sessão. Ao salvar, `invalidateQueries` atualiza a lista.

📄 `use-scroll-to-top.ts`: num SPA a rolagem não volta ao topo ao trocar de página. Este hook resolve isso e respeita âncoras como `/sobre#faq`.

### ✅ Ponto de checagem da Fase 4

No `main.tsx` temporário:

```tsx
import { productService } from '@/services/product.service'
productService.list({ category: 'polos' }).then(console.log)
```

O console do navegador deve mostrar `{ data: [...4 polos], total: 4, ... }`.

---

## Fase 5 — Componentes compartilhados

**Começo:** dados funcionando. **Fim:** todas as peças que as páginas vão montar.

### 5.1 `components/common/` (genéricos, servem para qualquer loja)

| Arquivo                                                                                                                                            | Destaque                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Seo.tsx`                                                                                                                                          | O React 19 move `<title>` e `<meta>` para o `<head>` sozinho, sem biblioteca extra. Também gera `canonical`, Open Graph e o JSON-LD (dados estruturados).    |
| `Logo.tsx`                                                                                                                                         | A marca "≋ GILMAR AFONSO", idêntica à original, como link para a Home.                                                                                       |
| `ProductImage.tsx`                                                                                                                                 | `loading="lazy"` (só baixa perto da tela), `decoding="async"` e `onError` → silhueta. `object-contain` mantém a regra do CSS antigo: **não cortar o rosto**. |
| `Price.tsx`                                                                                                                                        | Preço "de/por" com `sr-only` ("De R$ 109,90 Por R$ 89,90" para o leitor de tela), parcelamento e preço no Pix.                                               |
| `Rating.tsx`                                                                                                                                       | `role="img"` + `aria-label` faz as 5 estrelas serem lidas como "Avaliação 4,8 de 5".                                                                         |
| `FormField.tsx`                                                                                                                                    | Liga label, campo e erro com `useId`, `aria-invalid` e `aria-describedby`. **Todo** campo do site usa este componente.                                       |
| `PasswordField.tsx`                                                                                                                                | Botão de mostrar e ocultar a senha, com `aria-pressed`.                                                                                                      |
| `Reveal.tsx`                                                                                                                                       | Animação de entrada ao rolar a página (Framer Motion, `whileInView`, `once: true`).                                                                          |
| `Pagination.tsx`                                                                                                                                   | `aria-current="page"` na página atual.                                                                                                                       |
| `EmptyState.tsx`, `PageLoader.tsx`, `FormAlert.tsx`, `Breadcrumbs.tsx`, `SectionHeading.tsx`, `Divider.tsx`, `SocialIcons.tsx`, `GoogleButton.tsx` | Peças pequenas reaproveitadas. O `GoogleButton` já está no visual final e avisa que chega na Fase 2.                                                         |

### 5.2 `components/ecommerce/` (específicos da loja)

📄 `ProductCard.tsx`: o `.product-card` antigo.

- `memo(...)`: o card só redesenha se o **produto** mudar. Adicionar algo ao carrinho não redesenha a grade inteira.
- `quickAdd`: o botão de sacola do card antigo. Agora ele escolhe a primeira cor e o tamanho M e mostra um toast com a ação "Ver carrinho".
- Os selos "-18%" e "Esgotado" são calculados a partir dos dados.

📄 `ProductGrid.tsx`: três estados numa peça só: carregando (esqueletos), vazio ("Nenhum produto encontrado") e lista.

📄 `CartDrawer.tsx`: o `aside.cart-drawer` antigo, agora com `Sheet`. Abre e fecha pela store (`isDrawerOpen`), então **qualquer** componente consegue abrir o carrinho.

📄 `CartLineItem.tsx` + `QuantitySelector.tsx`: a linha do carrinho, usada na gaveta e na página `/carrinho`. Os botões "−" e "+" têm `aria-label` com o nome do produto.

📄 `OrderSummary.tsx`: subtotal, frete, cupom, Pix e total como lista de definição (`<dl>`), a marcação semântica correta para pares "rótulo: valor".

📄 `FreeShippingProgress.tsx`: "Faltam R$ 89,20 para o frete grátis". Incentiva o cliente a gastar mais e usa `role="progressbar"`.

📄 `CouponForm.tsx`, `ShippingEstimator.tsx`: cupom e cálculo de frete por CEP, com estados de carregando, erro e sucesso.

📄 `ProductGallery.tsx`

- O zoom calcula a posição do mouse em porcentagem (`(clientX - rect.left) / rect.width * 100`) e usa esse ponto como `transform-origin` com `scale(2)`: a foto amplia exatamente onde o cursor está.
- O clique abre um `Dialog` em tela cheia (no celular não existe "passar o mouse").

📄 `VariantSelectors.tsx`: cor e tamanho são `<input type="radio">` escondidos com `sr-only` e estilizados pelo `peer-checked:`. Assim continuam sendo rádios de verdade, com setas do teclado e leitor de tela, mas com o visual da marca.

📄 `ProductFiltersPanel.tsx`: categoria, preço, marca, avaliação e disponibilidade. **Não tem estado próprio**: recebe `filters` e chama `onChange`. Quem guarda os filtros é a URL (Fase 7).

### 5.3 `components/layout/`

📄 `Header.tsx`

- `sticky top-0` + `backdrop-blur`: o cabeçalho fica fixo e translúcido.
- `NavLink` marca o link da página atual.
- O badge do carrinho só aparece com itens, e o `aria-label` diz "Abrir carrinho, 3 itens".
- No celular, o menu é um `Sheet` à esquerda, no lugar do `.main-nav.open` antigo.

📄 `SearchBar.tsx`: a busca instantânea segue o padrão ARIA **combobox**:

- `role="combobox"` no campo e `role="listbox"`/`role="option"` nas sugestões;
- as setas ↑ ↓ mudam `activeIndex` e `aria-activedescendant` informa ao leitor de tela qual opção está ativa;
- `onMouseDown={(e) => e.preventDefault()}` impede o campo de perder o foco antes do clique na sugestão.

📄 `Footer.tsx`, `AnnouncementBar.tsx`: o rodapé original, mais uma coluna de categorias e a faixa de benefícios no topo.

### ✅ Ponto de checagem da Fase 5

`npx tsc -b && npx eslint .` sem erros.

---

## Fase 6 — Layouts, rotas e ponto de entrada

**Começo:** peças soltas. **Fim:** a navegação montada (as páginas entram na Fase 7).

📄 `src/layouts/StoreLayout.tsx`: cabeçalho, `<Outlet />` (onde a página da rota aparece), rodapé e gaveta do carrinho.

- O link **"Pular para o conteúdo"** é invisível até receber foco pelo Tab (WCAG 2.4.1).
- O `<Suspense>` mostra o `PageLoader` enquanto o código da página é baixado.

📄 `CheckoutLayout.tsx`: sem menu nem rodapé. Menos distração no checkout aumenta a conversão (prática de Shopify e VTEX).

📄 `AuthLayout.tsx`: o formulário à esquerda e a foto da marca à direita, com a foto só no desktop.

📄 `src/routes/guards.tsx`: o "middleware de autenticação".

- `PrivateRoute`: sem sessão, redireciona para `/entrar` e guarda **de onde veio** em `state.from`. Depois do login, `useLogin(from)` devolve o cliente para lá.
- `PrivateRoute role="admin"` já está pronto para o painel da Fase 3.
- `GuestRoute`: quem já está logado e abre `/entrar` vai direto para `/conta`.

📄 `src/routes/index.tsx`

- `lazy(() => import('@/pages/Home'))` é o **code splitting**. Cada página vira um arquivo `.js` separado: quem só olha a Home não baixa o código do checkout. Veja o resultado do `npm run build`: `Home-xxx.js`, `Checkout-xxx.js` etc.
- Três grupos de rotas, um por layout. As rotas privadas ficam "embrulhadas" pelo `PrivateRoute`.
- `errorElement`: se uma página quebrar, aparece a tela `RouteError` em vez de uma tela branca.
- `createHashRouter` só existe para hospedagens que não aceitam reescrita de rotas. Em produção use o padrão (`browser`).

📄 `src/providers/AppProviders.tsx`: `QueryClientProvider` (com `retry: 1` e `refetchOnWindowFocus: false`), `MotionConfig reducedMotion="user"` e o `Toaster`. Tudo o que é global fica aqui.

📄 `src/App.tsx` e 📄 `src/main.tsx`: o mínimo possível. `StrictMode` roda os efeitos duas vezes em desenvolvimento, de propósito, para revelar bugs.

### ✅ Ponto de checagem da Fase 6

Crie páginas provisórias (`export default function HomePage() { return <p>Home</p> }`) em cada pasta citada nas rotas. `npm run dev` deve mostrar o cabeçalho, o rodapé e a troca de páginas pelo menu.

---

## Fase 7 — Páginas

Digite nesta ordem: cada página usa o que as anteriores já testaram.

### 7.1 Home: 📄 `src/pages/Home/`

O `index.tsx` só **organiza** as seções. Cada seção em `sections/` busca os próprios dados.

- `Hero.tsx`: a mesma composição do original (texto à esquerda, foto à direita e degradê por cima). No celular, a foto vai para cima e o texto desce, como no CSS antigo. `fetchPriority="high"` avisa o navegador que é a imagem mais importante (melhora o LCP).
- `Benefits.tsx`, `Categories.tsx`, `BrandStory.tsx`: as seções originais, com ícones lucide no lugar dos símbolos ♧ ◇ ▤.
- `ProductShelf.tsx`: **um componente para três vitrines** (destaques, mais vendidos e promoções). Muda só o `filters`.
- `PromoBanner.tsx`, `Testimonials.tsx`: as seções novas pedidas no escopo.

### 7.2 Listagem: 📄 `src/pages/Products/`

📄 `use-url-filters.ts`: **os filtros vivem na URL**.

- `useSearchParams` lê `?categoria=polos&ordem=price-asc&pagina=2`.
- O `PARAM` traduz os nomes: português na URL (amigável para o cliente e para o Google) e inglês no código.
- `updateFilters`: qualquer filtro novo **volta para a página 1**, senão o cliente ficaria na página 3 de uma lista que agora tem uma página só.
- `replace: true` nos filtros e `false` na paginação: o botão "voltar" do navegador volta de página, mas não desfaz cada clique de filtro.

📄 `index.tsx`: filtros na lateral (desktop) ou num `Sheet` (celular), ordenação com `NativeSelect` e o contador com `aria-live` (o leitor de tela anuncia "4 produtos" ao filtrar).

### 7.3 Produto: 📄 `src/pages/ProductDetails/`

- `<ProductView key={slug} />`: o `key` faz o React **recriar** o componente ao trocar de produto, zerando cor e tamanho escolhidos. Sem ele, ao clicar num relacionado, o tamanho do produto anterior continuaria marcado.
- `addToCart` sem tamanho escolhido mostra o erro no seletor, em vez de adicionar um tamanho errado.
- O `jsonLd` informa preço, estoque e nota ao Google, que pode exibir estrelas no resultado de busca.
- `Tabs`: Descrição, Especificações e Avaliações. Os produtos relacionados ficam abaixo.

### 7.4 Carrinho: 📄 `src/pages/Cart/index.tsx`

Os mesmos componentes da gaveta (`CartLineItem`, `OrderSummary`, `CouponForm`), mais o cálculo de frete. É a prova de que componentizar valeu a pena.

### 7.5 Checkout: 📄 `src/pages/Checkout/`

📄 `checkout-schema.ts`: o schema Zod do formulário inteiro.
`.superRefine` torna os campos do cartão obrigatórios **só** quando `paymentMethod === 'card'`. É a forma correta de fazer validação condicional.

📄 `index.tsx`

- `useForm({ resolver: zodResolver(checkoutSchema), mode: 'onTouched' })`: valida ao sair do campo, sem gritar erro a cada tecla.
- `FormProvider`: as seções usam `useFormContext()` e não precisam receber `register` por props.
- `useWatch` observa CEP, frete e pagamento e recalcula os totais na hora (o Pix mostra o desconto assim que é marcado).
- `onSubmit`, em três passos comentados: (1) tokenizar o cartão no gateway, (2) criar o pedido, (3) salvar o endereço. O `try/catch` mostra um erro amigável se algo falhar.

📄 `sections/AddressSection.tsx`

- O CEP com 8 dígitos dispara a ViaCEP. O `useEffect` preenche rua, bairro, cidade e UF e leva o cursor para o **número** (`setFocus`).
- Cliente logado: os endereços salvos aparecem como opções, e o principal já vem selecionado (`useRef` garante que isso aconteça uma única vez).

📄 `sections/ShippingSection.tsx`: quando chegam as opções, pré-seleciona a mais barata.

📄 `sections/PaymentSection.tsx`: Pix, cartão e boleto. O parcelamento mostra o valor de cada parcela. O aviso explica que, em produção, os campos do cartão são substituídos pelo formulário seguro do gateway.

📄 `OrderSuccess.tsx`: busca o pedido pela URL (funciona até com F5), mostra o Pix copia e cola ou a linha do boleto com botão Copiar, a entrega e o resumo.

### 7.6 Autenticação: 📄 `src/pages/Login/` e 📄 `src/pages/Register/`

- Login: e-mail, senha, "Esqueci minha senha" e Google (preparado).
- Cadastro: nome, e-mail, telefone, senha e confirmação. O `.refine` compara as duas senhas e põe o erro no campo de confirmação (`path: ['confirmPassword']`).
- `ForgotPassword.tsx` → `ResetPassword.tsx?token=...`: o fluxo completo de recuperação.
- `noValidate` no `<form>` desliga os balões nativos do navegador, para valerem só as mensagens do Zod (padronizadas e em português).

### 7.7 Conta, Sobre e erros

- 📄 `Profile/index.tsx`: rota privada com dados, endereços salvos e botão Sair. Os cartões "Em breve" indicam o que chega na Fase 2.
- 📄 `About/index.tsx`: história, missão, visão, valores, diferenciais, cultura, FAQ (Accordion) e contato. **Os textos são exemplos: revise com o cliente.**
- 📄 `NotFound/index.tsx` e 📄 `RouteError.tsx`: 404 e erro inesperado.

### ✅ Ponto de checagem da Fase 7 (o teste completo)

1. Crie uma conta em `/cadastro`.
2. Abra um produto, tente adicionar sem tamanho (deve aparecer o erro), escolha G e adicione.
3. No carrinho, aplique `BEMVINDO10`.
4. No checkout, use o CEP `30130-000`, escolha PAC e pague com Pix.
5. Na confirmação, confira: subtotal − cupom − 5% do Pix + frete = total.
6. Faça uma segunda compra: o endereço salvo deve vir selecionado.

---

## Fase 8 — SEO, build e publicação

📄 `scripts/generate-sitemap.mjs`: usa o próprio Vite (`ssrLoadModule`) para ler o catálogo em TypeScript e grava `public/sitemap.xml` com todas as URLs. Roda sozinho no `npm run build`.

📄 `public/robots.txt`: libera a loja para o Google e bloqueia `/checkout` e `/conta`.

📄 `public/.htaccess`, `public/_redirects`, `vercel.json`: num SPA, quem abre `/produto/polo-classica-bordo` direto pede ao servidor um arquivo que não existe. Esses arquivos fazem o servidor responder com o `index.html`, e o React Router resolve a página.

**SEO entregue:** título e descrição por página, URL canônica, Open Graph, JSON-LD de produto, URLs amigáveis, sitemap, robots e `noindex` nas páginas privadas.

> **Limite honesto:** um SPA depende do JavaScript para mostrar o conteúdo. O Google renderiza JavaScript, mas WhatsApp, Facebook e LinkedIn não, e mostram só as meta tags padrão do `index.html` na prévia do link. Se a prévia de cada produto nas redes for importante, a evolução natural é migrar para pré-renderização (React Router em modo framework ou Next.js). A estrutura em pastas já facilita isso.

**Publicar:** `npm run build` → envie o **conteúdo** de `dist/` para a hospedagem.

---

## Fase 9 — Trocar a simulação pelo backend NestJS

O arquivo `src/services/mock/routes.ts` **é a especificação** do backend. Implemente no NestJS os mesmos endpoints, com as mesmas respostas:

| Método | Endpoint                   | Auth     | Resposta                                                                                                               |
| ------ | -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| GET    | `/products`                | —        | `Paginated<Product>` (query: q, category, brands, minPrice, maxPrice, minRating, inStock, onSale, sort, page, perPage) |
| GET    | `/products/facets`         | —        | `{ brands: string[], priceRange: { min, max } }`                                                                       |
| GET    | `/products/suggestions?q=` | —        | `Product[]` (até 5)                                                                                                    |
| GET    | `/products/:slug`          | —        | `Product`                                                                                                              |
| GET    | `/products/:slug/related`  | —        | `Product[]`                                                                                                            |
| GET    | `/products/:slug/reviews`  | —        | `Review[]`                                                                                                             |
| GET    | `/categories`              | —        | `Category[]`                                                                                                           |
| GET    | `/testimonials`            | —        | `Testimonial[]`                                                                                                        |
| POST   | `/coupons/validate`        | —        | `Coupon` ou 404                                                                                                        |
| POST   | `/shipping/quote`          | —        | `ShippingOption[]`                                                                                                     |
| POST   | `/orders`                  | opcional | `Order` (**recalcular preços no servidor**)                                                                            |
| GET    | `/orders/:id`              | —        | `Order`                                                                                                                |
| GET    | `/me/addresses`            | **sim**  | `Address[]`                                                                                                            |
| POST   | `/me/addresses`            | **sim**  | `Address`                                                                                                              |
| POST   | `/auth/register`           | —        | `{ user, accessToken }`                                                                                                |
| POST   | `/auth/login`              | —        | `{ user, accessToken }` ou 401                                                                                         |
| GET    | `/auth/me`                 | **sim**  | `User`                                                                                                                 |
| POST   | `/auth/forgot-password`    | —        | `{ message }` (envia e-mail)                                                                                           |
| POST   | `/auth/reset-password`     | —        | `{ message }`                                                                                                          |
| POST   | `/auth/google`             | —        | `{ user, accessToken }` (Fase 2)                                                                                       |

**Erros:** responda `{ "message": "texto para o cliente" }` com o status HTTP correto. O front já exibe essa mensagem.

**Checklist do backend:**

- Senhas com **bcrypt** ou **argon2**, nunca SHA puro.
- JWT de curta duração + _refresh token_ em cookie `HttpOnly`. A troca automática entra no interceptor de `src/services/api.ts`.
- `POST /orders` recalcula preço, estoque, frete e descontos a partir do banco.
- Pagamento: receba só o `paymentToken` e confirme no gateway pelo **webhook**, nunca pelo retorno do navegador.
- CORS liberado só para o domínio da loja.

Depois disso, no `.env`: `VITE_USE_MOCK_API=false` e `VITE_API_URL=` com a URL da API.

---

**CodeDog** — projeto desenvolvido para Gilmar Afonso Company Store.

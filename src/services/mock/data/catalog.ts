import type { Category, Product, Review, Testimonial } from '@/types'
import { slugify } from '@/utils/format'

/**
 * Catálogo simulado. Quando o backend existir, estes dados virão do PostgreSQL
 * pela API e este arquivo deixa de ser usado (VITE_USE_MOCK_API=false).
 *
 * Fotos: coloque os arquivos em public/images/products/ com os nomes abaixo.
 * Enquanto a foto não existir, o componente <ProductImage> mostra uma silhueta provisória.
 */
const img = (file: string) => `/images/products/${file}`

const COLORS = {
  preto: { name: 'Preto', hex: '#111111' },
  branco: { name: 'Branco', hex: '#f4f3ef' },
  cinza: { name: 'Cinza', hex: '#8a8a88' },
  bordo: { name: 'Bordô', hex: '#6b1f2a' },
  verde: { name: 'Verde militar', hex: '#4b5340' },
  marinho: { name: 'Azul-marinho', hex: '#1f2a44' },
  azulClaro: { name: 'Azul claro', hex: '#b9cde3' },
  areia: { name: 'Areia', hex: '#d8c8a8' },
  offWhite: { name: 'Off-white', hex: '#ece6da' },
}

const SIZES = ['P', 'M', 'G', 'GG']

const specs = (
  fabric: string,
  fit: string,
  care = 'Lavar à mão ou na máquina em ciclo delicado, água fria.',
) => [
  { label: 'Composição', value: fabric },
  { label: 'Modelagem', value: fit },
  { label: 'Origem', value: 'Fabricado no Brasil' },
  { label: 'Cuidados', value: care },
]

type Seed = Omit<Product, 'id' | 'slug' | 'specs' | 'sizes' | 'createdAt'> &
  Partial<Pick<Product, 'specs' | 'sizes'>>

const seeds: Seed[] = [
  {
    name: 'Polo Clássica Bordô',
    subtitle: 'Algodão premium',
    description:
      'A polo que funciona do escritório ao fim de semana. Malha piquet de algodão premium, gola estruturada que não deforma e botões em tom sobre tom.',
    price: 119.9,
    categorySlug: 'polos',
    brand: 'Gilmar Afonso',
    images: [img('polo-bordo.jpeg'), img('polo-bordo-costas.jpeg')],
    colors: [COLORS.bordo, COLORS.preto, COLORS.branco],
    rating: 4.8,
    reviewCount: 64,
    stock: 24,
    soldCount: 412,
    isFeatured: true,
  },
  {
    name: 'Camisa Social Branca',
    subtitle: 'Corte elegante',
    description:
      'Camisa social de corte elegante em tricoline com toque macio. Colarinho italiano, punho com dois botões e acabamento premium em cada costura.',
    price: 159.9,
    categorySlug: 'camisas-sociais',
    brand: 'GA Social',
    images: [img('camisa-social-branca.jpeg'), img('camisa-social-branca-detalhe.jpeg')],
    colors: [COLORS.branco, COLORS.preto],
    rating: 4.9,
    reviewCount: 38,
    stock: 15,
    soldCount: 230,
    isFeatured: true,
    specs: specs(
      '100% algodão tricoline fio 60',
      'Slim fit',
      'Lavar na máquina e passar com ferro morno.',
    ),
  },
  {
    name: 'Polo Clássica Preta',
    subtitle: 'Essencial masculino',
    description:
      'O essencial do guarda-roupa masculino. Piquet de algodão premium com caimento reto e acabamento impecável.',
    price: 119.9,
    categorySlug: 'polos',
    brand: 'Gilmar Afonso',
    images: [img('polo-preta.jpeg')],
    colors: [COLORS.preto, COLORS.branco, COLORS.cinza],
    rating: 4.7,
    reviewCount: 81,
    stock: 30,
    soldCount: 520,
    isFeatured: false,
  },
  {
    name: 'Camisa Social Preta',
    subtitle: 'Visual sofisticado',
    description:
      'Visual sofisticado para ocasiões especiais. Tecido com leve elastano que acompanha o movimento sem amassar.',
    price: 159.9,
    categorySlug: 'camisas-sociais',
    brand: 'GA Social',
    images: [img('camisa-social-preta.jpeg')],
    colors: [COLORS.preto, COLORS.branco],
    rating: 4.8,
    reviewCount: 27,
    stock: 12,
    soldCount: 190,
    isFeatured: true,
    specs: specs(
      '97% algodão, 3% elastano',
      'Slim fit',
      'Lavar na máquina e passar com ferro morno.',
    ),
  },
  {
    name: 'Polo Branca',
    subtitle: 'Clássica e versátil',
    description:
      'Clássica e versátil, combina com jeans, sarja ou alfaiataria. Malha respirável para os dias quentes.',
    price: 119.9,
    categorySlug: 'polos',
    brand: 'Gilmar Afonso',
    images: [img('polo-branca.jpeg')],
    colors: [COLORS.branco, COLORS.preto, COLORS.cinza],
    rating: 4.6,
    reviewCount: 33,
    stock: 18,
    soldCount: 205,
    isFeatured: false,
  },
  {
    name: 'Camiseta Cinza',
    subtitle: 'Básica premium',
    description:
      'A básica que não é básica: algodão penteado de toque macio, gola canelada reforçada e costura dupla.',
    price: 89.9,
    categorySlug: 'camisetas',
    brand: 'GA Essentials',
    images: [img('camiseta-cinza.jpeg')],
    colors: [COLORS.cinza, COLORS.preto, COLORS.branco],
    rating: 4.7,
    reviewCount: 95,
    stock: 40,
    soldCount: 610,
    isFeatured: false,
  },
  {
    name: 'Camiseta Preta',
    subtitle: 'Essencial minimalista',
    description:
      'Essencial minimalista em algodão penteado 30.1. O preto intenso permanece mesmo depois de muitas lavagens.',
    price: 89.9,
    categorySlug: 'camisetas',
    brand: 'GA Essentials',
    images: [img('camiseta-preta.jpeg')],
    colors: [COLORS.preto, COLORS.branco, COLORS.cinza],
    rating: 4.9,
    reviewCount: 120,
    stock: 50,
    soldCount: 780,
    isFeatured: true,
  },
  {
    name: 'Camiseta Verde Militar',
    subtitle: 'Casual contemporânea',
    description:
      'Tom verde militar para um visual casual contemporâneo. Modelagem regular e tecido encorpado.',
    price: 89.9,
    compareAtPrice: 109.9,
    categorySlug: 'camisetas',
    brand: 'GA Essentials',
    images: [img('camiseta-verde-militar.jpeg')],
    colors: [COLORS.verde, COLORS.preto, COLORS.cinza],
    rating: 4.6,
    reviewCount: 41,
    stock: 22,
    soldCount: 260,
    isFeatured: true,
  },
  {
    name: 'Moletom Careca Preto',
    subtitle: 'Felpado premium',
    description:
      'Moletom careca felpado por dentro, punhos e barra em ribana. Quentinho sem perder a elegância.',
    price: 229.9,
    compareAtPrice: 269.9,
    categorySlug: 'moletons',
    brand: 'Gilmar Afonso',
    images: [img('moletom-careca-preto.jpeg')],
    colors: [COLORS.preto, COLORS.cinza],
    rating: 4.8,
    reviewCount: 22,
    stock: 14,
    soldCount: 150,
    isFeatured: true,
    specs: specs('80% algodão, 20% poliéster, felpado', 'Regular fit'),
  },
  {
    name: 'Moletom Canguru Cinza Mescla',
    subtitle: 'Com capuz e bolso',
    description:
      'Moletom canguru com capuz forrado, bolso frontal e cordão em algodão. O companheiro dos dias frios.',
    price: 249.9,
    categorySlug: 'moletons',
    brand: 'Gilmar Afonso',
    images: [img('moletom-canguru-cinza.jpeg')],
    colors: [COLORS.cinza, COLORS.preto],
    rating: 4.7,
    reviewCount: 18,
    stock: 9,
    soldCount: 98,
    isFeatured: false,
    specs: specs('80% algodão, 20% poliéster, felpado', 'Regular fit'),
  },
  {
    name: 'Camiseta Off-White',
    subtitle: 'Tom neutro',
    description:
      'Tom off-white que foge do branco óptico e combina com tudo. Algodão penteado de alta gramatura.',
    price: 89.9,
    categorySlug: 'camisetas',
    brand: 'GA Essentials',
    images: [img('camiseta-off-white.jpeg')],
    colors: [COLORS.offWhite],
    rating: 4.5,
    reviewCount: 12,
    stock: 0,
    soldCount: 140,
    isFeatured: false,
  },
  {
    name: 'Polo Piquet Azul-Marinho',
    subtitle: 'Clássico atemporal',
    description:
      'O azul-marinho clássico em malha piquet com detalhe de vivo na gola e nas mangas.',
    price: 129.9,
    compareAtPrice: 149.9,
    categorySlug: 'polos',
    brand: 'Gilmar Afonso',
    images: [img('polo-azul-marinho.jpeg')],
    colors: [COLORS.marinho, COLORS.branco],
    rating: 4.7,
    reviewCount: 29,
    stock: 16,
    soldCount: 176,
    isFeatured: false,
  },
  {
    name: 'Camisa Social Azul Clara',
    subtitle: 'Para o dia a dia no escritório',
    description:
      'Camisa social azul clara com tratamento que facilita o passar. Ideal para a rotina de trabalho.',
    price: 169.9,
    categorySlug: 'camisas-sociais',
    brand: 'GA Social',
    images: [img('camisa-social-azul.jpeg')],
    colors: [COLORS.azulClaro, COLORS.branco],
    rating: 4.6,
    reviewCount: 15,
    stock: 11,
    soldCount: 87,
    isFeatured: false,
    specs: specs(
      '100% algodão fácil de passar',
      'Slim fit',
      'Lavar na máquina e passar com ferro morno.',
    ),
  },
  {
    name: 'Camisa Oxford Branca',
    subtitle: 'Textura marcante',
    description:
      'Tecido oxford com textura marcante e colarinho com botões. Elegância que dispensa gravata.',
    price: 179.9,
    categorySlug: 'camisas-sociais',
    brand: 'GA Social',
    images: [img('camisa-oxford-branca.jpeg')],
    colors: [COLORS.branco, COLORS.azulClaro],
    rating: 4.9,
    reviewCount: 21,
    stock: 7,
    soldCount: 112,
    isFeatured: false,
    specs: specs(
      '100% algodão oxford',
      'Regular fit',
      'Lavar na máquina e passar com ferro morno.',
    ),
  },
  {
    name: 'Camiseta Areia',
    subtitle: 'Leve e respirável',
    description: 'Cor areia, toque leve e tecido respirável. Perfeita para os dias de calor.',
    price: 89.9,
    categorySlug: 'camisetas',
    brand: 'GA Essentials',
    images: [img('camiseta-areia.jpeg')],
    colors: [COLORS.areia, COLORS.branco],
    rating: 4.4,
    reviewCount: 9,
    stock: 26,
    soldCount: 64,
    isFeatured: false,
  },
  {
    name: 'Moletom Zíper Verde Militar',
    subtitle: 'Jaqueta em moletom',
    description:
      'Jaqueta em moletom com zíper metálico e bolsos laterais. Uma terceira peça versátil.',
    price: 259.9,
    categorySlug: 'moletons',
    brand: 'Gilmar Afonso',
    images: [img('moletom-ziper-verde.jpeg')],
    colors: [COLORS.verde, COLORS.preto],
    rating: 4.8,
    reviewCount: 11,
    stock: 6,
    soldCount: 58,
    isFeatured: false,
    specs: specs('80% algodão, 20% poliéster, felpado', 'Regular fit'),
  },
]

export const products: Product[] = seeds.map((seed, index) => ({
  ...seed,
  id: `p${index + 1}`,
  slug: slugify(seed.name),
  sizes: seed.sizes ?? SIZES,
  specs: seed.specs ?? specs('100% algodão penteado', 'Regular fit'),
  // Datas decrescentes para a ordenação "Lançamentos" funcionar
  createdAt: new Date(Date.UTC(2026, 9, 30 - index)).toISOString(),
}))

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'camisetas',
    name: 'Camisetas',
    description: 'Básicas premium para o dia a dia.',
    image: img('camiseta-cinza.jpeg'),
  },
  {
    id: 'c2',
    slug: 'polos',
    name: 'Polos',
    description: 'Piquet de algodão com gola estruturada.',
    image: img('polo-bordo.jpeg'),
  },
  {
    id: 'c3',
    slug: 'camisas-sociais',
    name: 'Camisas Sociais',
    description: 'Corte elegante para ocasiões especiais.',
    image: img('camisa-social-branca.jpeg'),
  },
  {
    id: 'c4',
    slug: 'moletons',
    name: 'Moletons',
    description: 'Conforto felpado para os dias frios.',
    image: img('moletom-careca-preto.jpeg'),
  },
]

const reviewTexts = [
  {
    title: 'Superou minhas expectativas',
    comment: 'Tecido de ótima qualidade e o caimento ficou perfeito. Já quero outras cores.',
    rating: 5,
  },
  {
    title: 'Acabamento impecável',
    comment: 'Dá para ver o cuidado nas costuras. Chegou antes do prazo e muito bem embalada.',
    rating: 5,
  },
  {
    title: 'Muito boa',
    comment:
      'Gostei bastante. Achei a forma um pouco justa, recomendo pegar um número acima se preferir mais solta.',
    rating: 4,
  },
  {
    title: 'Vale cada centavo',
    comment: 'Lavei várias vezes e continua igual. Excelente custo-benefício.',
    rating: 5,
  },
]
const authors = ['Rafael M.', 'Lucas A.', 'Carla S.', 'Bruno T.', 'Fernanda R.', 'Diego P.']

export const reviews: Review[] = products.flatMap((product, p) =>
  reviewTexts.slice(0, 2 + (p % 3)).map((text, r) => ({
    id: `${product.id}-r${r}`,
    productId: product.id,
    author: authors[(p + r) % authors.length] ?? 'Cliente',
    ...text,
    createdAt: new Date(Date.UTC(2026, 10, 15 - r * 6 - p)).toISOString(),
    verifiedPurchase: r !== 2,
  })),
)

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Marcelo Andrade',
    city: 'Belo Horizonte, MG',
    rating: 5,
    text: 'Comprei polos para a equipe toda. Qualidade excelente, entrega rápida e atendimento muito atencioso.',
  },
  {
    id: 't2',
    author: 'Juliana Costa',
    city: 'São Paulo, SP',
    rating: 5,
    text: 'A camisa social tem um caimento que eu não encontrava em outras lojas. Virei cliente.',
  },
  {
    id: 't3',
    author: 'Paulo Henrique',
    city: 'Contagem, MG',
    rating: 5,
    text: 'Peças que duram. Minha camiseta preta continua preta depois de um ano de uso.',
  },
]

/** Cupons válidos na simulação. */
export const coupons = [
  { code: 'BEMVINDO10', percentOff: 0.1, description: '10% na primeira compra' },
  { code: 'GA15', percentOff: 0.15, description: '15% de desconto' },
]

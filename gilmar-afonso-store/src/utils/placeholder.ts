/**
 * Gera uma imagem SVG provisória (silhueta de camiseta na cor do produto).
 * É usada quando a foto real ainda não foi colocada em public/images/products.
 */
export function productPlaceholder(hex = '#cfcdc6', label = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750">
  <rect width="600" height="750" fill="#eeede8"/>
  <path d="M215 150 L160 170 L90 250 L140 300 L185 265 L185 600 L415 600 L415 265 L460 300 L510 250 L440 170 L385 150 Q300 210 215 150 Z"
    fill="${hex}" stroke="#00000018" stroke-width="3"/>
  <text x="300" y="680" font-family="Arial, sans-serif" font-size="22" fill="#8a887f" text-anchor="middle">${label}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

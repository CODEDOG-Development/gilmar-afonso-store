import { STORE } from '@/constants'

/** Ícones das redes em SVG (o lucide não traz logotipos de marcas). */
const icons = {
  Instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
  ),
  Facebook: (
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.2-1.4 1.5-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.3H8v3h2.6V21h2.9Z" />
  ),
  TikTok: (
    <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.3.1-2.6-.3-3.9-1.1v5.6c0 6.9-7.5 9-10.5 4.1-1.9-3.2-.7-8.7 5.6-8.9v2.7c-.5.1-1 .2-1.4.4-1.4.5-2.2 1.4-2 3 .4 3.1 6.1 4 5.6-2V3h2.7Z" />
  ),
}

export function SocialIcons() {
  const links = [
    { label: 'Instagram', href: STORE.instagram },
    { label: 'Facebook', href: STORE.facebook },
    { label: 'TikTok', href: STORE.tiktok },
  ] as const
  return (
    <div className="flex gap-2">
      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} da Gilmar Afonso`}
          className="grid size-9 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
            {icons[label]}
          </svg>
        </a>
      ))}
    </div>
  )
}

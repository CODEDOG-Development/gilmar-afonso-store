import { motion, type HTMLMotionProps } from 'framer-motion'

/**
 * Faz o conteúdo surgir suavemente quando entra na tela.
 * Respeita "reduzir movimento" do sistema (configurado no MotionConfig em providers).
 */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    />
  )
}

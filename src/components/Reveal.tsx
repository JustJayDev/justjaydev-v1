import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const reduce = useReducedMotion()

  /* when the user asks for reduced motion, render still with no animation */
  if (reduce) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

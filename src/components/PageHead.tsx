import { ReactNode } from 'react'
import Reveal from './Reveal'

export default function PageHead({
  label,
  title,
  lede,
  children,
}: {
  label: string
  title: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <Reveal>
      <p className="mono-label">{label}</p>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
      {lede && <p className="mt-3 max-w-xl text-dim">{lede}</p>}
      {children}
    </Reveal>
  )
}

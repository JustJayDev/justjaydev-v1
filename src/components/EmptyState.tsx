import Reveal from './Reveal'

/*
 * Honest empty state. Used wherever real content is missing, so the site
 * never has to fill a gap with invented filler.
 */
export default function EmptyState({
  label,
  title,
  body,
}: {
  label: string
  title: string
  body?: string
}) {
  return (
    <Reveal delay={0.1}>
      <div className="panel corner-brackets mt-8 px-6 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
        <p className="mt-3 font-display text-xl font-bold">{title}</p>
        {body && <p className="mx-auto mt-2 max-w-sm text-sm text-dim">{body}</p>}
      </div>
    </Reveal>
  )
}

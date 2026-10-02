import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import { links } from '../data/content'

/* Slots for socials Jay has not provided yet. Labelled honestly as empty,
   not faked out with a guessed URL. */
const openSlots = ['X / Twitter', 'Instagram', 'YouTube', 'Discord']

export default function Links() {
  return (
    <div>
      <PageHead label="// endpoints" title="Links" lede="Every place to find me." />

      <div className="mt-6 space-y-3">
        {links.map((l, i) => (
          <Reveal key={l.id} delay={i * 0.05}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="panel corner-brackets flex items-center justify-between gap-3 p-4 transition-colors hover:border-accent/50 focus-visible:border-accent"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  {l.label}
                </span>
                <span className="mt-0.5 block truncate font-display text-base font-bold">
                  {l.handle}
                </span>
              </span>
              <span aria-hidden="true" className="shrink-0 font-mono text-xs text-accent">
                &#8599;
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mono-label mt-8">// reserved</p>
        <ul className="mt-3 space-y-2">
          {openSlots.map((s) => (
            <li
              key={s}
              className="flex items-center justify-between gap-3 border border-dashed border-line p-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-dim">{s}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                empty
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          slots open - links added when provided
        </p>
      </Reveal>
    </div>
  )
}

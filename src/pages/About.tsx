import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import { aboutFacts, identity } from '../data/content'

export default function About() {
  return (
    <div>
      <PageHead label="// operator" title="About" />

      <Reveal delay={0.05}>
        <div className="panel mt-6 p-5">
          <p className="font-display text-lg font-bold leading-snug">{identity.name}</p>
          <p className="font-mono text-xs text-accent">&commat;{identity.handle}</p>
          <p className="mt-4 text-sm leading-relaxed text-dim">
            {identity.name} is {identity.handle}, a mobile gamer who builds on his{' '}
            {identity.builtOn.toLowerCase()}. He plays {identity.mainGame}.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <dl className="panel mt-3 divide-y divide-line">
          {aboutFacts.map((f) => (
            <div key={f.k} className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{f.k}</dt>
              <dd className="text-right font-mono text-sm text-txt">{f.v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-3 space-y-3">
          <p className="panel corner-brackets p-5 text-center font-display text-lg font-bold leading-snug text-accent">
            {identity.motto}
          </p>
          <p className="panel corner-brackets p-5 text-center font-display text-base text-dim">
            {identity.creed}
          </p>
        </div>
      </Reveal>
    </div>
  )
}

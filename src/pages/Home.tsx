import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { buildQueue, shippedCount, devlog, identity } from '../data/content'

export default function Home() {
  const planned = buildQueue.length

  /* every number is computed from real data, never typed in by hand */
  const readout = [
    { label: 'BUILT ON', value: identity.builtOn.toUpperCase() },
    { label: 'SHIPPED', value: String(shippedCount).padStart(2, '0') },
    { label: 'PLANNED', value: String(planned).padStart(2, '0') },
    { label: 'STATUS', value: 'STARTING' },
  ]

  return (
    <div>
      <section className="hero-glow -mx-4 px-4 pt-10 pb-12">
        <Reveal>
          <p className="mono-label">// operator online</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Mobile gamer with a <span className="text-accent">builder&rsquo;s mind</span>
          </h1>
          <p className="mt-4 max-w-xl text-dim">
            {identity.name} is {identity.handle}, a mobile gamer who builds on his{' '}
            {identity.builtOn.toLowerCase()}. Nothing here is finished yet &mdash; that changes soon.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="corner-brackets border border-accent px-5 py-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Build Queue
            </Link>
            <Link
              to="/games"
              className="border border-line px-5 py-2 font-mono text-xs uppercase tracking-widest text-dim transition-colors hover:border-accent/50 hover:text-txt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Games
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mt-4">
        <Reveal>
          <h2 className="mono-label">// live readout</h2>
          <div className="panel mt-3 grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
            {readout.map((r) => (
              <div key={r.label} className="border-b border-line p-4 sm:border-b-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{r.label}</div>
                <div className="mt-1 font-mono text-lg text-accent">{r.value}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {devlog.length > 0 && (
        <section className="mt-12">
          <Reveal>
            <h2 className="mono-label">// latest transmissions</h2>
            <div className="mt-3 space-y-3">
              {devlog.slice(0, 3).map((e) => (
                <Reveal key={e.id}>
                  <Link
                    to="/devlog"
                    className="panel corner-brackets flex items-start justify-between gap-3 p-4 transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="font-display text-sm">{e.title}</span>
                    <time dateTime={e.date} className="shrink-0 font-mono text-[10px] text-dim">
                      {e.date}
                    </time>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <Reveal>
        <p className="mt-10 text-center font-display text-sm italic text-dim">
          {identity.motto}
        </p>
      </Reveal>
    </div>
  )
}

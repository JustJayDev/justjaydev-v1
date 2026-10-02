import Reveal from '../components/Reveal'
import { buildQueue, shippedCount, games } from '../data/content'
import { devlog } from '../data/devlog'

export default function Home() {
  const planned = buildQueue.length

  // every number below is computed from real data, never typed in
  const readout = [
    { label: 'BUILT ON', value: 'PHONE' },
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
            Jay Kumar. I grind {games[0]?.name ?? 'mobile games'}, and I build on my phone. Nothing
            here is finished yet &mdash; that changes soon.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/justjaydev-v1/projects"
              className="corner-brackets border border-accent px-5 py-2 font-mono text-xs uppercase tracking-widest text-accent"
            >
              Build Queue
            </a>
            <a
              href="/justjaydev-v1/games"
              className="border border-line px-5 py-2 font-mono text-xs uppercase tracking-widest text-dim hover:text-txt"
            >
              Games
            </a>
          </div>
        </Reveal>
      </section>

      <section className="mt-4">
        <Reveal>
          <p className="mono-label">// live readout</p>
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

      <section className="mt-12">
        <Reveal>
          <p className="mono-label">// latest transmissions</p>
          <div className="mt-3 space-y-3">
            {devlog.slice(0, 3).map((e) => (
              <Reveal key={e.id}>
                <div className="panel corner-brackets flex items-start justify-between gap-3 p-4">
                  <span className="font-display text-sm">{e.title}</span>
                  <span className="shrink-0 font-mono text-[10px] text-dim">{e.date}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}

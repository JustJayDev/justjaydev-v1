import Reveal from '../components/Reveal'

const readout = [
  { label: 'BUILT ON', value: 'PHONE' },
  { label: 'PROJECTS', value: '05' },
  { label: 'DEVLOG', value: '19' },
  { label: 'STATUS', value: 'GRINDING' },
]

export default function Home() {
  return (
    <div>
      <section className="hero-glow -mx-4 px-4 pt-10 pb-12">
        <Reveal>
          <p className="mono-label">// operator online</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Mobile gamer with a <span className="text-accent">builder&rsquo;s mind</span>
          </h1>
          <p className="mt-4 max-w-xl text-dim">
            Jay Kumar &mdash; I build apps, websites and games with AI, grind Free Fire Max,
            and everything I make, I make on my phone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects" className="corner-brackets border border-accent px-5 py-2 font-mono text-xs uppercase tracking-widest text-accent">
              View Projects
            </a>
            <a href="#devlog" className="border border-line px-5 py-2 font-mono text-xs uppercase tracking-widest text-dim hover:text-txt">
              Read Devlog
            </a>
          </div>
        </Reveal>
      </section>

      <section id="projects" className="mt-4">
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

      <section id="devlog" className="mt-12">
        <Reveal>
          <p className="mono-label">// latest transmissions</p>
          <div className="mt-3 space-y-3">
            {[
              { t: 'Blueprint Terminal — the new identity', d: '2026-10-04' },
              { t: 'Lab section added — AI & Operit work', d: '2026-10-02' },
              { t: 'Links hub — one tap to everything', d: '2026-09-28' },
            ].map((e) => (
              <Reveal key={e.t}>
                <div className="panel corner-brackets flex items-center justify-between p-4">
                  <span className="font-display text-sm">{e.t}</span>
                  <span className="font-mono text-[10px] text-dim">{e.d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}

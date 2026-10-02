import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import MockupFrame from '../components/MockupFrame'
import { games } from '../data/content'

export default function Games() {
  return (
    <div>
      <PageHead
        label="// loadout"
        title="Games"
        lede="What I actually play. No fake stats, no fake ranks."
      />

      {games.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="panel corner-brackets mt-8 px-6 py-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">no titles yet</p>
            <p className="mt-3 font-display text-xl font-bold">Nothing listed yet.</p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-6 space-y-4">
          {games.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.05}>
              <article className="panel corner-brackets">
                <MockupFrame variant={i} title={String(i + 1).padStart(2, '0')} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-bold">{g.name}</h2>
                    <span className="shrink-0 border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                      {g.platform}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dim">{g.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal>
        <p className="mt-8 border border-dashed border-line p-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          more titles get added as they come up
        </p>
      </Reveal>
    </div>
  )
}

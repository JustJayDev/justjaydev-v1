import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import { buildQueue, shippedCount } from '../data/content'

export default function Projects() {
  const planned = buildQueue.length

  return (
    <div>
      <PageHead
        label="// build queue"
        title="Projects"
        lede="Nothing shipped yet. This is the queue of what I plan to build from scratch, in order."
      />

      <div className="mt-6">
        <Reveal delay={0.05}>
          <div className="panel grid grid-cols-2 divide-x divide-line">
            {[
              { l: 'SHIPPED', v: String(shippedCount).padStart(2, '0') },
              { l: 'PLANNED', v: String(planned).padStart(2, '0') },
            ].map((s) => (
              <div key={s.l} className="p-3 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{s.l}</div>
                <div className="mt-1 font-mono text-xl text-accent">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {planned === 0 ? (
        <Reveal delay={0.1}>
          <div className="panel corner-brackets mt-8 px-6 py-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">queue empty</p>
            <p className="mt-3 font-display text-xl font-bold">First build coming soon.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-dim">
              Nothing here yet. Every project on this site will be built from scratch, and it gets
              added here when it does.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 space-y-3">
          {buildQueue.map((idea, i) => (
            <Reveal key={idea.id} delay={i * 0.04}>
              <article className="panel corner-brackets p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-0.5 font-display text-base font-bold">{idea.title}</h3>
                  </div>
                  <span className="shrink-0 border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                    planned
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-dim">{idea.blurb}</p>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

import PageHead from '../components/PageHead'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import { experiments, labIntro } from '../data/content'

export default function Lab() {
  return (
    <div>
      <PageHead label="// sandbox" title="Lab" lede={labIntro} />

      {experiments.length === 0 ? (
        <EmptyState
          label="nothing running"
          title="First experiment coming soon."
          body="Anything that works gets written up here."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {experiments.map((x, i) => (
            <Reveal key={x.id} delay={i * 0.05}>
              <article className="panel corner-brackets p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-base font-bold">{x.title}</h2>
                  <span className="shrink-0 border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                    {x.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-dim">{x.blurb}</p>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

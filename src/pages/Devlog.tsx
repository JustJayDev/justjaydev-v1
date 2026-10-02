import PageHead from '../components/PageHead'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import { devlog } from '../data/content'

export default function Devlog() {
  return (
    <div>
      <PageHead
        label="// log"
        title="Devlog"
        lede="Short notes from the build. Newest first."
      />

      {devlog.length === 0 ? (
        <EmptyState label="no entries" title="First entry coming soon." />
      ) : (
        <ol className="mt-6 space-y-3">
          {devlog.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.05}>
              <li className="panel corner-brackets p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-base font-bold">{e.title}</h2>
                  <time
                    dateTime={e.date}
                    className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-dim"
                  >
                    {e.date}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-dim">{e.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      )}

      <Reveal>
        <p className="mt-8 border border-dashed border-line p-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          more coming
        </p>
      </Reveal>
    </div>
  )
}

import PageHead from '../components/PageHead'
import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import { projects } from '../data/content'

export default function Projects() {
  const live = projects.filter((p) => p.status === 'live' || p.status === 'shipped').length
  const wip = projects.filter((p) => p.status === 'building').length
  const idea = projects.filter((p) => p.status === 'planned').length

  return (
    <div>
      <PageHead
        label="// index of work"
        title="Projects"
        lede="Apps, sites and tools I designed, built and shipped - every one of them from a phone screen."
      />

      <div className="mt-6">
        <Reveal delay={0.05}>
          <div className="panel grid grid-cols-3 divide-x divide-line">
            {[
              { l: 'SHIPPED', v: String(live).padStart(2, '0') },
              { l: 'BUILDING', v: String(wip).padStart(2, '0') },
              { l: 'PLANNED', v: String(idea).padStart(2, '0') },
            ].map((s) => (
              <div key={s.l} className="p-3 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{s.l}</div>
                <div className="mt-1 font-mono text-xl text-accent">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-8 space-y-4">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.04}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 border border-dashed border-line p-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          more in the pipeline - built during downtime
        </p>
      </Reveal>
    </div>
  )
}

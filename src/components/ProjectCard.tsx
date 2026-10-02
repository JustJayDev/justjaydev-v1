import { Project, statusMeta } from '../data/content'
import MockupFrame from './MockupFrame'

export default function ProjectCard({ project }: { project: Project }) {
  const meta = statusMeta[project.status]
  return (
    <article className="panel corner-brackets group">
      <MockupFrame variant={project.variant} title={project.index} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="font-mono text-[10px] tracking-[0.2em] text-dim">{project.index}</span>
            <h3 className="mt-0.5 truncate font-display text-base font-bold">{project.title}</h3>
          </div>
          <span
            className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${meta.tone}`}
          >
            {meta.label}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-dim">{project.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-dim/80">{project.detail}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="border border-line px-2 py-0.5 font-mono text-[10px] text-dim">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{project.year}</span>
          <div className="flex gap-3">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim hover:text-accent"
              >
                code
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
              >
                open
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import Avatar from '../components/Avatar'
import Avatar3DLoader from '../components/Avatar3DLoader'
import GamerCard from '../components/GamerCard'
import { aboutFacts, identity, contact, links, reservedSlots } from '../data/content'

export default function About() {
  const hasEmail = contact.email.trim() !== ''

  return (
    <div>
      <PageHead label="// operator" title="About" />

      <Reveal delay={0.05}>
        <div className="panel mt-6 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
          {/* avatar slot: monogram until Jay uploads a photo */}
          <Avatar size={72} />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-snug">{identity.name}</p>
            <p className="font-mono text-xs text-accent">&commat;{identity.handle}</p>
            <p className="mt-3 text-sm leading-relaxed text-dim">
              {identity.name} is {identity.handle}, a mobile gamer who builds on his{' '}
              {identity.builtOn.toLowerCase()}. He plays {identity.mainGame}.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ---------- 3D avatar + gamer card ----------
       * The loader ships a static poster in the prerendered HTML and only
       * pulls 3D code once this section is scrolled into view.
       */}
      <Reveal delay={0.08}>
        <section className="mt-8" aria-labelledby="avatar-h">
          <h2 id="avatar-h" className="mono-label">
            // avatar
          </h2>
          <div className="mt-3 grid gap-3 lg:grid-cols-2 lg:items-start">
            <Avatar3DLoader />
            <GamerCard />
          </div>
        </section>
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

      {/* ---------- contact ---------- */}
      <Reveal delay={0.15}>
        <section className="mt-8" aria-labelledby="contact-h">
          <h2 id="contact-h" className="mono-label">
            // contact
          </h2>

          <div className="panel mt-3 divide-y divide-line">
            {/* email slot */}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                EMAIL
              </span>
              {hasEmail ? (
                <a
                  href={'mailto:' + contact.email}
                  className="truncate text-right font-mono text-sm text-accent underline underline-offset-4 hover:text-txt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {contact.email}
                </a>
              ) : (
                <span className="text-right font-mono text-sm italic text-dim">
                  {contact.emailPending}
                </span>
              )}
            </div>

            {/* real socials */}
            {links.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  {l.label.toUpperCase()}
                </span>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="truncate text-right font-mono text-sm text-accent underline underline-offset-4 hover:text-txt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {l.handle}
                </a>
              </div>
            ))}

            {/* socials Jay has not provided yet */}
            {reservedSlots.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  {s.label.toUpperCase()}
                </span>
                <span className="text-right font-mono text-sm italic text-dim">empty</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-8 space-y-3">
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
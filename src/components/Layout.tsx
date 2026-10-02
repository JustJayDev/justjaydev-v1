import { ReactNode, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import BackToTop from './BackToTop'
import AssistantLoader from './AssistantLoader'
import { pages, identity } from '../data/content'

const nav = pages.map((p) => ({ to: p.path, label: p.nav }))

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  /* close the mobile menu whenever the route changes */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /* a new route scrolls back to the top, so the light page transition starts
     from a known position instead of mid-page */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  // Escape closes it, and lock body scroll while it is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const linkBase =
    'font-mono uppercase tracking-widest rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <div className="flex min-h-screen flex-col bp-grid">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-bg focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-accent"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo />

          <nav aria-label="Main" className="hidden gap-4 sm:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `${linkBase} text-[11px] ${isActive ? 'text-accent' : 'text-dim hover:text-txt'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="font-mono text-xs text-accent sm:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((v) => !v)}
          >
            [ {open ? 'CLOSE' : 'MENU'} ]
          </button>
        </div>

        <div id="mnav" hidden={!open} className="border-t border-line sm:hidden">
          <nav aria-label="Mobile" className="mx-auto grid max-w-3xl grid-cols-2 gap-1 px-4 py-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `${linkBase} px-2 py-2 text-xs ${isActive ? 'text-accent' : 'text-dim'}`
                }
              >
                &gt; {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 lg:max-w-4xl"
      >
        {/* key on pathname replays the light fade on every route change;
            the CSS kills it entirely under prefers-reduced-motion */}
        <div key={pathname} className="page-enter">
          {children}
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-4 lg:max-w-4xl">
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
            {identity.motto}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim">v1.0</span>
        </div>
      </footer>

      <BackToTop />
      <AssistantLoader />
    </div>
  )
}

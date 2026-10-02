import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/games', label: 'Games' },
  { to: '/devlog', label: 'Devlog' },
  { to: '/lab', label: 'Lab' },
  { to: '/about', label: 'About' },
  { to: '/links', label: 'Links' },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bp-grid">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden gap-4 sm:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `font-mono text-[11px] uppercase tracking-widest ${isActive ? 'text-accent' : 'text-dim hover:text-txt'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <button
            className="font-mono text-xs text-accent sm:hidden"
            aria-label="Open menu"
            onClick={() => document.getElementById('mnav')?.classList.toggle('hidden')}
          >
            [ MENU ]
          </button>
        </div>
        <div id="mnav" className="hidden border-t border-line sm:hidden">
          <nav className="mx-auto grid max-w-3xl grid-cols-2 gap-1 px-4 py-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `font-mono text-xs uppercase tracking-widest px-2 py-2 ${isActive ? 'text-accent' : 'text-dim'}`
                }
              >
                &gt; {n.label}
              </NavLink>
            ))
            }
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim">A King Never Wavers</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim">v1.0</span>
        </div>
      </footer>
    </div>
  )
}

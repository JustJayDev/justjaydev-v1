import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <Reveal>
        {/* the 404 code IS this page's heading, so screen readers announce it */}
        <h1 className="font-mono text-5xl font-bold text-accent">404</h1>
        <p className="mt-4 font-mono text-xs text-dim">command not found: page</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-dim">
          That route does not exist on this site.
        </p>
        <Link
          to="/"
          className="corner-brackets mt-8 inline-block border border-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to home
        </Link>
      </Reveal>
    </div>
  )
}

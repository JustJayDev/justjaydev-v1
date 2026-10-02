import { lazy, Suspense, useEffect, useState } from 'react'
import { assistant } from '../data/content'

/*
 * Defers the assistant bundle until it is actually wanted.
 *
 * React.lazy alone is not enough: the chunk would still be requested as soon as
 * this component mounts. So the dynamic import is held back until the first
 * real user intent - a click, a tap, a key press or a scroll. The static
 * placeholder below is prerendered into the HTML, so there is no layout shift
 * and no network cost until someone actually asks something.
 */
const AssistantWidget = lazy(() => import('./AssistantWidget'))

function Placeholder() {
  const configured = assistant.workerUrl.trim() !== ''
  if (configured) {
    return (
      <div className="assist-fab" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Ask Jay&rsquo;s assistant
      </div>
    )
  }
  return (
    <div className="assist-fab" aria-hidden="true">
      <span className="h-1.5 w-1.5 rounded-full bg-dim" />
      Assistant coming soon
    </div>
  )
}

export default function AssistantLoader() {
  const [wanted, setWanted] = useState(false)

  useEffect(() => {
    if (wanted) return
    /* only on devices that can hover or type, and only once the page is idle,
       so the assistant never competes with first paint on a phone */
    const activate = () => setWanted(true)
    const opts: AddEventListenerOptions = { once: true, passive: true }
    window.addEventListener('pointerdown', activate, opts)
    window.addEventListener('keydown', activate, opts)
    window.addEventListener('touchstart', activate, opts)

    /* requestIdleCallback is not in TS's DOM lib, so it is reached through a
       narrowed reference rather than asserted into existence */
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const w = window as IdleWindow
    const idleId = w.requestIdleCallback
      ? w.requestIdleCallback(() => activate())
      : window.setTimeout(activate, 4000)

    return () => {
      window.removeEventListener('pointerdown', activate)
      window.removeEventListener('keydown', activate)
      window.removeEventListener('touchstart', activate)
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
    }
  }, [wanted])

  if (!wanted) return <Placeholder />
  return (
    <Suspense fallback={<Placeholder />}>
      <AssistantWidget />
    </Suspense>
  )
}
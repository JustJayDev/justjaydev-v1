/*
 * Avatar3DLoader - the shell that decides whether 3D runs at all.
 *
 * Order of events, and each step is a gate on the next:
 *   1. The STATIC poster is prerendered into the HTML, so the About page is
 *      complete with JavaScript disabled and costs nothing on first paint.
 *   2. An IntersectionObserver watches the section. Nothing about 3D is
 *      downloaded until it is actually scrolled into view.
 *   3. Only then is a "turn on 3D" button offered. Tapping it imports the
 *      viewer chunk. No model means the button never appears.
 *
 * If the visitor prefers reduced motion, the button is still offered, but the
 * auto-spin is switched off inside the viewer, so nothing moves unless asked.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { avatar3d } from '../data/content'
import AvatarPoster from './AvatarPoster'

/* three.js lives ONLY in this dynamic import, so it can never reach the entry
   bundle or be fetched by a visitor who does not open the avatar */
const Avatar3D = lazy(() => import('./Avatar3D'))

function prefersReduced() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Avatar3DLoader() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const [on, setOn] = useState(false)
  const [reduce, setReduce] = useState(false)

  /* honour a reduced-motion change made after load */
  useEffect(() => {
    setReduce(prefersReduced())
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* gate 1: 3D code is not even considered until the section is seen */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      /* start loading a little before it is on screen, so it is ready on arrival */
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const turnOff = useCallback(() => setOn(false), [])

  const hasModel = avatar3d.modelUrl.trim() !== ''

  return (
    <div ref={sectionRef} className="avatar3d-shell">
      {/* the poster is always in the DOM: it is the static first paint, the
          no-JS fallback, and what is left after 3D is turned off */}
      <div className="avatar3d-frame" data-3d={on && hasModel ? 'on' : 'off'}>
        <AvatarPoster />

        {on && hasModel && (
          <Suspense
            fallback={
              <p className="avatar3d-loading" role="status">
                Starting 3D…
              </p>
            }
          >
            <Avatar3D onOff={turnOff} prefersReducedMotion={reduce} />
          </Suspense>
        )}

        {hasModel && !on && inView && (
          <button
            type="button"
            className="avatar3d-enable tap"
            onClick={() => setOn(true)}
          >
            Turn on 3D
          </button>
        )}
      </div>

      {/* one honest line about where the model goes. No invented 3D art. */}
      <p className="avatar3d-hint">{hasModel ? avatar3d.hint + ' Drag it to rotate.' : avatar3d.hint}</p>
    </div>
  )
}
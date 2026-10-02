import { useEffect, useState } from 'react'

/*
 * Back-to-top for long pages. Hidden until there is something to scroll back
 * to, and keyboard reachable. Pure CSS transition, so reduced-motion in
 * index.css turns it off.
 */
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className="to-top"
      data-show={show ? 'true' : 'false'}
      /* keep it out of the tab order while it is invisible */
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    >
      <span aria-hidden="true">&#8593;</span>
    </button>
  )
}
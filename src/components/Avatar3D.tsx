/*
 * Avatar3D - the actual 3D viewer.
 *
 * This file is a SEPARATE lazy chunk. It is only ever imported by
 * Avatar3DLoader once the section is scrolled into view, the user asks for 3D,
 * and a model actually exists, so a visitor who never reaches the avatar never
 * downloads a single byte of 3D code.
 *
 * three.js is imported here and nowhere else, so it can never leak into the
 * entry bundle and hurt the Lighthouse score on the other pages.
 *
 * Everything is written by hand rather than pulled from OrbitControls etc., so
 * the chunk stays small and the behaviour matches the accessibility rules:
 * drag to rotate, keyboard arrows to rotate, and nothing moves on its own when
 * the visitor asked for reduced motion.
 */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { avatar3d, avatarHotspots } from '../data/content'

type Status = 'loading' | 'ready' | 'failed'

export default function Avatar3D({
  onOff,
  prefersReducedMotion,
}: {
  onOff: () => void
  prefersReducedMotion: boolean
}) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [active, setActive] = useState<string | null>(null)

  /* rotation the user has dragged to, in radians */
  const targetRotation = useRef(0)
  const currentRotation = useRef(0)
  /* pointer state for drag-to-rotate */
  const drag = useRef<{ id: number; x: number; last: number; moved: boolean } | null>(null)

  /* ---- scene setup, once ---- */
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.1, 3.2)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setStatus('failed')
      setError('This browser could not start WebGL.')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    const pivot = new THREE.Group()
    scene.add(pivot)

    /* two soft lights, matching the site's cyan-on-dark blueprint look */
    const key = new THREE.DirectionalLight(0x22d3ee, 2.4)
    key.position.set(2, 3, 2)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffffff, 0.7)
    rim.position.set(-3, -1, -2)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0x223344, 1.6))

    const loader = new GLTFLoader()
    loader.load(
      avatar3d.modelUrl,
      (gltf) => {
        if (disposed) return
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        /* fit any model Jay drops in, whatever its original scale */
        const scale = 1.9 / maxDim
        gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
        gltf.scene.scale.setScalar(scale)
        pivot.add(gltf.scene)
        setStatus('ready')
      },
      undefined,
      (err: unknown) => {
        if (disposed) return
        /* the loader types the failure callback as unknown, so the message is
           narrowed rather than assumed */
        const detail =
          typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : ''
        setStatus('failed')
        setError(
          'The 3D model could not be loaded.' + (detail ? ' ' + detail : ''),
        )
      },
    )

    /* ---- render loop ---- */
    let raf = 0
    const clock = new THREE.Clock()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = clock.getDelta()
      /* auto-spin only when motion is allowed and nobody is dragging */
      if (!prefersReducedMotion && drag.current === null) {
        targetRotation.current += (avatar3d.spinDegPerSec * Math.PI * dt) / 180
      }
      /* ease toward the target so a drag feels smooth, not stepped */
      currentRotation.current += (targetRotation.current - currentRotation.current) * 0.12
      pivot.rotation.y = currentRotation.current
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    /* ---- sizing ---- */
    const resize = () => {
      const w = mount.clientWidth || 320
      const h = mount.clientHeight || 320
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    /* ---- drag to rotate (pointer events cover mouse, touch and pen) ---- */
    const canvas = renderer.domElement
    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      drag.current = { id: e.pointerId, x: e.clientX, last: e.clientX, moved: false }
    }
    const onMove = (e: PointerEvent) => {
      const d = drag.current
      if (!d || d.id !== e.pointerId) return
      const dx = e.clientX - d.last
      if (Math.abs(e.clientX - d.x) > 4) d.moved = true
      d.last = e.clientX
      targetRotation.current += dx * 0.012
    }
    const onUp = (e: PointerEvent) => {
      if (drag.current && drag.current.id === e.pointerId) drag.current = null
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    /* ---- pause rendering when scrolled away or the tab is hidden ---- */
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      pivot.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) mat.dispose()
      })
      renderer.dispose()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [prefersReducedMotion])

  /* ---- keyboard rotation, so the viewer is usable without a pointer ---- */
  const nudge = (dir: number) => {
    targetRotation.current += (dir * 15 * Math.PI) / 180
  }

  return (
    <div className="avatar3d-stage">
      <div className="avatar3d-canvas" ref={mountRef} />

      {/* hotspots sit above the canvas; values are gamer details only */}
      <ul className="avatar3d-hotspots" aria-label="Avatar details">
        {avatarHotspots.map((h) => {
          const value = h.value.trim() === '' ? h.pending : h.value
          const empty = h.value.trim() === ''
          const on = active === h.id
          return (
            <li key={h.id} style={{ left: h.x + '%', top: h.y + '%' }}>
              <button
                type="button"
                className={`avatar3d-dot${on ? ' is-open' : ''}`}
                aria-expanded={on}
                onClick={() => setActive(on ? null : h.id)}
                onFocus={() => setActive(h.id)}
                onBlur={() => setActive(null)}
              >
                <span className="sr-only">
                  {h.label}: {value}
                </span>
                <span aria-hidden="true" className="avatar3d-dot-core" />
              </button>
              <span
                className="avatar3d-tip"
                data-open={on ? 'true' : 'false'}
                role="presentation"
              >
                <span className="avatar3d-tip-label">{h.label}</span>
                <span className={'avatar3d-tip-value' + (empty ? ' is-empty' : '')}>
                  {value}
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      {/* status line, always readable, never colour-only */}
      <p className="avatar3d-status" role="status">
        {status === 'loading' && 'Loading 3D\u2026'}
        {status === 'ready' && (prefersReducedMotion ? 'Drag to rotate.' : 'Drag to rotate. Tap a dot for details.')}
        {status === 'failed' && error}
      </p>

      <div className="avatar3d-controls">
        <button type="button" className="tap" onClick={() => nudge(-1)}>
          <span aria-hidden="true">&#8592;</span> Rotate left
        </button>
        <button type="button" className="tap" onClick={() => nudge(1)}>
          Rotate right <span aria-hidden="true">&#8594;</span>
        </button>
        <button type="button" className="tap avatar3d-off" onClick={onOff}>
          Turn off 3D
        </button>
      </div>
    </div>
  )
}
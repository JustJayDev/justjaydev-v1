/*
 * AvatarPoster - the static, always-present placeholder for the 3D avatar.
 *
 * Deliberately NOT a likeness of Jay, and deliberately not a picture of a
 * person: it is an original blueprint wireframe bust drawn in CSS and SVG. It
 * marks the exact frame his own .glb will occupy, so when the model arrives the
 * page changes shape without shifting the layout at all.
 *
 * Pure HTML/CSS/SVG means it is in the prerendered HTML and costs no JavaScript.
 */
import { avatar3d } from '../data/content'

export default function AvatarPoster() {
  return (
    <div className="avatar3d-poster" aria-hidden="true">
      <div className="bp-grid avatar3d-poster-grid" />

      {/* original stylised wireframe bust - a drawing, not a person */}
      <svg
        className="avatar3d-poster-svg"
        viewBox="0 0 200 200"
        fill="none"
        role="presentation"
      >
        <defs>
          <linearGradient id="jjp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* head */}
        <path
          d="M100 44c19 0 32 13 32 32 0 20-13 36-32 36s-32-16-32-36c0-19 13-32 32-32Z"
          stroke="url(#jjp)"
          strokeWidth="2"
        />
        {/* shoulders */}
        <path
          d="M52 168c4-26 24-40 48-40s44 14 48 40"
          stroke="url(#jjp)"
          strokeWidth="2"
        />
        {/* visor line, the gamer read, kept abstract */}
        <path d="M76 88h48" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
        {/* wireframe cross-section hints */}
        <path
          d="M100 44v68M68 78h64M74 100h52"
          stroke="#22d3ee"
          strokeWidth="0.75"
          strokeOpacity="0.5"
          strokeDasharray="3 4"
        />
      </svg>

      {/* technical-drawing registration marks */}
      <div className="avatar3d-poster-mark tl" />
      <div className="avatar3d-poster-mark tr" />
      <div className="avatar3d-poster-mark bl" />
      <div className="avatar3d-poster-mark br" />

      <p className="avatar3d-poster-label">
        avatar.glb
        <span className="avatar3d-poster-sub">under {(avatar3d.maxBytes / (1024 * 1024))} MB</span>
      </p>
    </div>
  )
}
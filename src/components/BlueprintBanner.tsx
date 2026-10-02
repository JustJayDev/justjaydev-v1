/*
 * Stylized Blueprint Terminal banner.
 *
 * Deliberately NOT game artwork. No official logos, characters or screenshots -
 * those are copyrighted. This is an original CSS/SVG placeholder that marks
 * exactly where Jay's own screenshot will go once he provides one.
 */
export default function BlueprintBanner({ title }: { title: string }) {
  return (
    <div className="img-slot" aria-hidden="true">
      <div className="bp-grid absolute inset-0" />
      {/* corner registration marks, like a technical drawing */}
      <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-accent/50" />
      <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-accent/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
        {/* crosshair placeholder frame */}
        <div className="flex h-16 w-24 items-center justify-center border border-dashed border-accent/50">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="#22d3ee" strokeWidth="1.5" />
            <path d="M7 9l3 3-3 3M13 15h4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
          screenshot slot
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
          {title}
        </p>
      </div>
    </div>
  )
}
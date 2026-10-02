
/*
 * Stylized mockup visual - pure CSS, no real screenshots.
 * Each variant lays out different blueprint-style glyphs so cards
 * look distinct without shipping image assets.
 */
const glyphs = [
  // 0: stacked panel lines
  [60, 40, 30, 18, 24],
  // 1: sidebar + rows
  [22, 46, 46, 46, 30],
  // 2: grid tiles
  [28, 28, 28, 28],
  // 3: tall columns
  [34, 50, 26, 44],
  // 4: waveform
  [18, 40, 26, 44, 30, 20, 36],
]

export default function MockupFrame({ variant = 0, title }: { variant?: number; title?: string }) {
  const bars = glyphs[variant % glyphs.length]
  return (
    <div className="bp-grid relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-bg">
      {/* faint corner mark */}
      <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-accent/50" />
      <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-accent/50" />
      {/* mono watermark label */}
      <span className="absolute right-2 top-2 font-mono text-[9px] uppercase tracking-[0.18em] text-dim/60">
        {title ?? 'mockup'}
      </span>
      {/* glyph composition */}
      <div className="absolute inset-0 flex items-end gap-1.5 p-4">
        {bars.map((w, i) => (
          <div
            key={i}
            style={{ width: `${w}%` }}
            className="corner-brackets h-2.5 border border-accent/25 bg-accent/[0.06]"
          />
        ))}
      </div>
    </div>
  )
}

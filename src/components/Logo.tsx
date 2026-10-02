export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="JustJayDev">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="10" fill="#0d141d" />
        <rect x="1.5" y="1.5" width="61" height="61" rx="8.5" fill="none" stroke="#1a2432" strokeWidth="3" />
        <text x="14" y="42" fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="28" fill="#22d3ee">JJ</text>
        <rect x="14" y="48" width="10" height="4" fill="#22d3ee" />
      </svg>
      <span className="font-mono text-sm tracking-widest text-txt">JUSTJAYDEV</span>
    </span>
  )
}

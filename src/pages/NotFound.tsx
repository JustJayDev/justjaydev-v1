export default function NotFound() {
  return (
    <div className="panel p-8 text-center">
      <p className="mono-label">// 404</p>
      <p className="mt-3 font-mono text-lg text-txt">command not found: page</p>
      <a href="/" className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-accent">&gt; return home</a>
    </div>
  )
}

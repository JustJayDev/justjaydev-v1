import { useEffect, useRef, useState } from 'react'
import { assistant } from '../data/content'

/*
 * "Ask Jay's assistant" chat widget.
 *
 * LAZY LOADED - this file is a separate chunk (see AssistantLoader), so none of
 * it is downloaded until the FAB is actually pressed. The site loads fine if
 * this component never runs.
 *
 * The Worker URL comes from a single config value. While it is empty the widget
 * renders an honest "Assistant coming soon" state and makes no network calls.
 */

type Msg = { from: 'me' | 'bot'; text: string }

const MAX_LOCAL = 24
const MAX_CHARS = 800

export default function AssistantWidget() {
  const configured = assistant.workerUrl.trim() !== ''
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  /* keep the newest message in view */
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs, busy])

  /* move focus into the panel when it opens */
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  /* Escape closes the panel */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  /* let CSS hide the back-to-top button while the panel is open */
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) document.body.setAttribute('data-assistant-open', 'true')
    else document.body.removeAttribute('data-assistant-open')
    return () => document.body.removeAttribute('data-assistant-open')
  }, [open])

  async function send() {
    const text = input.trim()
    if (text === '' || busy) return
    if (text.length > MAX_CHARS) {
      setError('That message is too long. Keep it shorter.')
      return
    }

    setError('')
    setInput('')
    setBusy(true)
    const mine: Msg = { from: 'me', text }

    try {
      const res = await fetch(assistant.workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error('bad status ' + res.status)
      const data = (await res.json()) as { reply?: string }
      const reply = typeof data.reply === 'string' ? data.reply : ''
      const theirs: Msg = {
        from: 'bot',
        text: reply === '' ? 'No reply came back.' : reply,
      }
      setMsgs((m) => [...m, mine, theirs].slice(-MAX_LOCAL))
    } catch {
      const theirs: Msg = {
        from: 'bot',
        text: 'The assistant is not reachable right now. Try again later.',
      }
      setMsgs((m) => [...m, mine, theirs].slice(-MAX_LOCAL))
    } finally {
      setBusy(false)
    }
  }

  if (!configured) {
    return (
      <div className="assist-fab" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-dim" />
        Assistant coming soon
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="assist-fab"
        aria-expanded={open}
        aria-controls="assist-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? '[ CLOSE ]' : '[ ASK ]'}</span>
        <span className="sr-only">Ask Jay&rsquo;s assistant</span>
      </button>

      {open && (
        <div
          id="assist-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Ask Jay's assistant"
          className="panel fixed inset-x-0 bottom-0 z-[70] flex max-h-[80vh] flex-col border-t border-accent sm:inset-x-auto sm:right-4 sm:bottom-20 sm:w-[380px] sm:border"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              ask jay&rsquo;s assistant
            </p>
            <button
              type="button"
              className="font-mono text-xs text-dim hover:text-txt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => setOpen(false)}
            >
              close
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
            aria-live="polite"
          >
            {msgs.length === 0 && (
              <p className="text-sm text-dim">
                Ask about Jay&rsquo;s site facts. It answers only from approved facts and will
                say so when it does not know.
              </p>
            )}
            {msgs.map((m, i) => (
              <p
                key={i}
                className={
                  m.from === 'me'
                    ? 'ml-8 border border-line px-3 py-2 text-sm'
                    : 'mr-8 border border-accent/40 px-3 py-2 text-sm'
                }
              >
                {m.text}
              </p>
            ))}
            {busy && (
              <p className="mr-8 border border-accent/40 px-3 py-2 font-mono text-xs text-dim">
                thinking...
              </p>
            )}
            {error !== '' && (
              <p role="alert" className="text-sm text-dim">
                {error}
              </p>
            )}
          </div>

          <form
            className="flex items-end gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
          >
            <label htmlFor="assist-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="assist-input"
              ref={inputRef}
              rows={2}
              value={input}
              maxLength={MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="min-h-[44px] flex-1 resize-none border border-line bg-bg px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <button
              type="submit"
              disabled={busy}
              className="min-h-[44px] shrink-0 border border-accent px-4 font-mono text-xs uppercase tracking-widest text-accent hover:bg-accent hover:text-bg disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
/**
 * "Ask Jay's assistant" - Cloudflare Worker.
 *
 * PROVIDER: Atria (OpenAI-compatible chat completions API).
 *   base URL : https://api.atria-asi.ai/v1
 *   model    : Atria-Dawn-Preview
 *
 * SECURITY: the Atria API key is read from the Worker SECRET ATRIA_API_KEY only.
 * It is never in this file, never in the repo, never in the site bundle, and
 * never logged or echoed in any response. Never hardcode it here.
 *
 * Setup steps: see README-setup.md in this folder.
 */
import { systemPrompt } from './facts.js'

/* ---- the ONLY origin allowed to call this Worker ------------------------ */
const ALLOWED_ORIGIN = 'https://justjaydev.github.io'

/* ---- limits ------------------------------------------------------------- */
const MAX_MESSAGE_CHARS = 800
const MAX_REPLY_CHARS = 600
const RATE_LIMIT = 8 // requests per minute, per visitor
const RATE_WINDOW_MS = 60_000
const DAILY_LIMIT = 100 // requests per 24h across ALL visitors (quota guard)
const DAILY_WINDOW_MS = 86_400_000

/* Atria - OpenAI-compatible endpoint */
const ATRIA_URL = 'https://api.atria-asi.ai/v1/chat/completions'
const MODEL = 'Atria-Dawn-Preview'
const MAX_TOKENS = 400

/* shown when the daily cap is hit */
const RESTING_MESSAGE = 'Assistant is resting, try later.'

/* ---- helpers ------------------------------------------------------------ */
function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin ?? ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

/**
 * Per-visitor rate limit, keyed on CF-Connecting-IP.
 * Kept in memory: good enough to stop casual abuse and costs nothing.
 */
function rateLimited(ip) {
  if (!ip) return false
  const now = Date.now()
  const store = rateLimited.store ?? (rateLimited.store = new Map())
  if (store.size > 5000) {
    for (const [key, hits] of store) {
      if (!hits.some((t) => now - t < RATE_WINDOW_MS)) store.delete(key)
    }
  }
  const hits = (store.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  hits.push(now)
  store.set(ip, hits)
  return hits.length > RATE_LIMIT
}

/**
 * DAILY CAP on total requests across every visitor, so strangers cannot use up
 * Jay's own Atria quota. Kept in memory: resets on isolate recycle, which errs
 * safe (it can only lower the count, never raise it past the cap).
 */
function dailyCapReached() {
  const now = Date.now()
  const state = dailyCapReached.state ?? (dailyCapReached.state = { count: 0, since: now })
  if (now - state.since > DAILY_WINDOW_MS) {
    state.count = 0
    state.since = now
  }
  state.count += 1
  return state.count > DAILY_LIMIT
}

function clamp(str, max) {
  const s = String(str ?? '').trim()
  return s.length > max ? s.slice(0, max) : s
}

/* ---- CORS preflight ----------------------------------------------------- */
function handleOptions(origin) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}

/* ---- main --------------------------------------------------------------- */
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? ''

    /* 1. origin allowlist - the site is the only permitted caller */
    if (origin !== ALLOWED_ORIGIN) {
      return json({ error: 'Not allowed.' }, 403, ALLOWED_ORIGIN)
    }
    if (request.method === 'OPTIONS') return handleOptions(origin)
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405, origin)
    }

    /* 2. rate limit per visitor */
    const ip = request.headers.get('CF-Connecting-IP') ?? ''
    if (rateLimited(ip)) {
      return json({ error: 'Too many messages. Wait a minute and try again.' }, 429, origin)
    }

    /* 3. daily total cap - protects Jay's quota from all visitors combined */
    if (dailyCapReached()) {
      return json({ error: RESTING_MESSAGE }, 429, origin)
    }

    /* 4. the secret must exist, or nothing works */
    const apiKey = env.ATRIA_API_KEY
    if (!apiKey) {
      return json({ error: 'The assistant is not set up yet.' }, 503, origin)
    }

    /* 5. read and cap the incoming message */
    let payload
    try {
      payload = await request.json()
    } catch {
      return json({ error: 'Bad request.' }, 400, origin)
    }
    const message = clamp(payload?.message, MAX_MESSAGE_CHARS)
    if (message === '') {
      return json({ error: 'Empty message.' }, 400, origin)
    }

    /* 6. call Atria (OpenAI-compatible) with the approved-facts system prompt */
    let upstream
    try {
      upstream = await fetch(ATRIA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
        }),
      })
    } catch {
      return json({ error: 'The assistant is unreachable right now.' }, 502, origin)
    }

    if (!upstream.ok) {
      /* deliberately vague: never leak upstream detail or the key */
      return json({ error: 'The assistant is unavailable right now.' }, 502, origin)
    }

    const data = await upstream.json()
    const text = data?.choices?.[0]?.message?.content ?? ''
    if (typeof text !== 'string' || text.trim() === '') {
      return json({ error: 'No reply came back.' }, 502, origin)
    }

    return json({ reply: clamp(text, MAX_REPLY_CHARS) }, 200, origin)
  },
}
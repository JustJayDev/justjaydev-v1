/**
 * "Ask Jay's assistant" - Cloudflare Worker.
 *
 * The Anthropic API key is read from a Worker SECRET only. It is never in this
 * file, never in the repo, never in the site bundle, and never logged.
 *
 * Setup steps: see README-setup.md in this folder.
 */

import { systemPrompt } from './facts.js'

/* ---- the ONLY origin allowed to call this Worker ------------------------ */
const ALLOWED_ORIGIN = 'https://justjaydev.github.io'

/* ---- limits ------------------------------------------------------------- */
const MAX_MESSAGE_CHARS = 800
const MAX_REPLY_CHARS = 600
const RATE_LIMIT = 8 // requests...
const RATE_WINDOW_MS = 60_000 // ...per minute, per visitor

/* Real Anthropic API model id. Change only to another current model id;
   a wrong id is the most common deploy mistake here. */
const MODEL = 'claude-sonnet-5-5'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

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

  // opportunistic cleanup so the map cannot grow without bound
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

    /* 3. the secret must exist, or nothing works */
    const apiKey = env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return json(
        { error: 'The assistant is not set up yet.' },
        503,
        origin,
      )
    }

    /* 4. read and cap the incoming message */
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

    /* 5. call Anthropic with the approved-facts system prompt */
    let upstream
    try {
      upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 400,
          system: systemPrompt,
          messages: [{ role: 'user', content: message }],
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
    const text = Array.isArray(data?.content)
      ? data.content
          .filter((block) => block?.type === 'text')
          .map((block) => block.text)
          .join(' ')
      : ''

    if (text === '') {
      return json({ error: 'No reply came back.' }, 502, origin)
    }

    return json({ reply: clamp(text, MAX_REPLY_CHARS) }, 200, origin)
  },
}
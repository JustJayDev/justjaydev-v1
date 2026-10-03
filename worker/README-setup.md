# Assistant Worker - setup (Atria)

The site widget calls this Worker. The Worker calls **Atria**
(`https://api.atria-asi.ai/v1`, model `Atria-Dawn-Preview`).

The Atria key lives **only** in the Cloudflare secret `ATRIA_API_KEY`. It is not
in this repo, not in the site bundle, and never logged.

## 1. Install wrangler and log in

```bash
cd worker
npm install
npx wrangler login
```

`wrangler login` prints a URL. Open it on any device, approve, then come back.

## 2. Set the secret (do this before or after deploy)

```bash
npx wrangler secret put ATRIA_API_KEY
```

It prompts for the value. Paste the Atria key, press Enter. It is stored
encrypted by Cloudflare and is not readable afterwards - that is the point.

## 3. Deploy

```bash
npx wrangler deploy
```

It prints the Worker URL, e.g.
`https://jj-assistant.<your-subdomain>.workers.dev`

## 4. Paste the URL into the site

Open `src/data/content.ts` and set:

```ts
export const assistant = {
  workerUrl: 'https://jj-assistant.<your-subdomain>.workers.dev',
  // ...
}
```

Then `npm run build:facts` (keeps `worker/src/facts.js` in sync) and rebuild
the site.

## Notes

- `wrangler.toml` may need your Worker name/account changed to match.
- The origin allowlist only accepts `https://justjaydev.github.io`. A request
  from any other origin gets 403. Keep it that way.
- Limits live at the top of `src/index.js`: 8 requests/min per visitor, 100
  requests/day total across all visitors, 800-char messages, 600-char replies.
- When the daily cap is hit the widget shows "Assistant is resting, try later."
- To change the daily cap, edit `DAILY_LIMIT`.
- Never commit a key. If you ever paste one into a file, remove it and rotate.

## Privacy guard

`facts.js` is generated from `src/data/assistant-facts.ts`. It contains only
the handle `@JustJayDev` - no real full name, no exact location, no age, height
or weight. The system prompt tells the assistant to say it does not know and to
point to the site pages rather than invent or confirm anything.
# Setting up the assistant Worker

The site ships with the assistant switched off. Until you finish these steps,
the button reads **"Assistant coming soon"** and nothing is sent anywhere.

The Worker lives in this `worker/` folder. It calls the Anthropic API on your
behalf. Your API key never goes near the website, the git repo or the browser:
it is stored only as a Cloudflare Worker **secret**.

---

## 1. Get an Anthropic API key

From the Anthropic Console, create an API key and add credit.

## 2. Create the Worker

Install the Wrangler CLI and log in:

```bash
cd worker
npm install
npx wrangler login
```

## 3. Deploy

```bash
npx wrangler deploy
```

Wrangler prints the URL when it finishes, for example:

```
https://jj-assistant.YOUR-NAME.workers.dev
```

## 4. Add the API key as a secret

Still inside `worker/`:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Paste the key when prompted. It is saved encrypted by Cloudflare, invisible to
git, and not printed back to you.

## 5. Turn the assistant on in the site

Open `src/data/content.ts` and find:

```ts
export const assistant = {
  workerUrl: '', // paste your Worker URL here to switch the widget on
  ...
}
```

Put the URL from step 3 between the quotes. Redeploy the site and the button
becomes live.

---

## How it behaves

- Only `https://justjaydev.github.io` may call it. Any other origin is refused.
- 8 messages per minute per visitor, then it asks the visitor to wait.
- Messages are capped at 800 characters, replies at 600.
- It answers only from the approved facts generated from `src/data/content.ts`.
  If you did not put something on the site, the assistant does not know it.
- Cloudflare request logging is off, so message text is not stored there.

## Changing what it knows

Edit `src/data/content.ts`, then from the site root:

```bash
npm run build:facts
```

That regenerates both `src/data/assistant-facts.ts` and `worker/src/facts.js`.
Push the repo, then run `npx wrangler deploy` again.

## Testing

```bash
npx wrangler dev
```

The assistant needs the secret to answer. Locally it is read from a `.dev.vars`
file in this folder, which must never be committed:

```
ANTHROPIC_API_KEY=sk-ant-...
```
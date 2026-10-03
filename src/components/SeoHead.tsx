import { useEffect } from 'react'

/*
 * Per-page document head. The prerender step reads the same page meta and
 * bakes these into the static HTML, so crawlers and no-JS readers see them too.
 */
export const SITE = {
  name: 'JustJayDev',
  url: 'https://justjaydev.github.io/justjaydev-v1',
  image: '/justjaydev-v1/og-image.png',
  theme: '#070b10',
  accent: '#22d3ee',
} as const

function upsertMeta(doc: Document, attr: 'name' | 'property', key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`
  let el = doc.head.querySelector<HTMLMetaElement>(sel)
  if (!el) {
    el = doc.createElement('meta')
    el.setAttribute(attr, key)
    doc.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(doc: Document, rel: string, href: string) {
  let el = doc.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = doc.createElement('link')
    el.setAttribute('rel', rel)
    doc.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applyHead(doc: Document, title: string, description: string, path: string) {
  doc.title = title
  const url = SITE.url + path

  upsertMeta(doc, 'name', 'description', description)
  upsertMeta(doc, 'name', 'author', '@JustJayDev')
  upsertMeta(doc, 'name', 'theme-color', SITE.theme)

  upsertMeta(doc, 'property', 'og:type', 'website')
  upsertMeta(doc, 'property', 'og:site_name', SITE.name)
  upsertMeta(doc, 'property', 'og:title', title)
  upsertMeta(doc, 'property', 'og:description', description)
  upsertMeta(doc, 'property', 'og:url', url)
  upsertMeta(doc, 'property', 'og:image', SITE.url + SITE.image)
  upsertMeta(doc, 'property', 'og:image:alt', `${SITE.name} - ${SITE.name}`)

  upsertMeta(doc, 'name', 'twitter:card', 'summary_large_image')
  upsertMeta(doc, 'name', 'twitter:title', title)
  upsertMeta(doc, 'name', 'twitter:description', description)
  upsertMeta(doc, 'name', 'twitter:image', SITE.url + SITE.image)

  upsertLink(doc, 'canonical', url)

  // JSON-LD
  let ld = doc.head.querySelector<HTMLScriptElement>('script[data-seo="ld"]')
  if (!ld) {
    ld = doc.createElement('script')
    ld.type = 'application/ld+json'
    ld.setAttribute('data-seo', 'ld')
    doc.head.appendChild(ld)
  }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url + path,
    description,
    author: { '@type': 'Person', name: '@JustJayDev', alternateName: 'JustJayDev' },
  })
}

export default function SeoHead({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    applyHead(document, title, description, path)
  }, [title, description, path])
  return null
}

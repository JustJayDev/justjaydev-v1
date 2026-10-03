/*
 * Prerenders every route to static HTML using the same React tree the browser
 * gets. Each page is written to dist/<route>/index.html with its own title,
 * description, OG tags and full visible content, so the site is readable
 * with JavaScript disabled and by crawlers.
 *
 * Head tags are injected as strings on purpose: no jsdom dependency, and the
 * output stays identical to what SeoHead writes at runtime.
 */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import Layout from '../src/components/Layout'
import Home from '../src/pages/Home'
import Projects from '../src/pages/Projects'
import Games from '../src/pages/Games'
import Devlog from '../src/pages/Devlog'
import Lab from '../src/pages/Lab'
import About from '../src/pages/About'
import Links from '../src/pages/Links'
import NotFound from '../src/pages/NotFound'
import { pages } from '../src/data/content'

type PageComponent = () => JSX.Element

const ROUTES: Record<string, PageComponent> = {
  '/': Home,
  '/projects': Projects,
  '/games': Games,
  '/devlog': Devlog,
  '/lab': Lab,
  '/about': About,
  '/links': Links,
}

const SITE = 'https://justjaydev.github.io/justjaydev-v1'
/*
 * MUST match <BrowserRouter basename> in src/main.tsx AND `base` in
 * vite.config.ts. React Router's useHref() prepends this to every Link
 * href, so without it the prerendered HTML ships root-relative hrefs
 * that break on hard refresh and direct visits under a project path.
 */
const BASENAME = '/justjaydev-v1'
const IMAGE = SITE + '/og-image.png'

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function headTags(
  title: string,
  description: string,
  path: string,
  indexable = true,
): string {
  const url = SITE + path
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JustJayDev',
    url,
    description,
    author: { '@type': 'Person', name: '@JustJayDev', alternateName: 'JustJayDev' },
  })

  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    '<meta name="author" content="@JustJayDev" />',
    // the 404 is an error page, never an indexable result
    indexable ? '' : '<meta name="robots" content="noindex, follow" />',
    '<meta name="theme-color" content="#070b10" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="JustJayDev" />',
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${IMAGE}" />`,
    '<meta property="og:image:alt" content="JustJayDev" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${IMAGE}" />`,
    indexable ? `<link rel="canonical" href="${url}" />` : '',
    `<script type="application/ld+json">${ld}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

const template = readFileSync(join('dist', 'index.html'), 'utf-8')

function renderPage(
  path: string,
  Comp: PageComponent,
  title: string,
  description: string,
  indexable = true,
): string {
  const body = renderToString(
    createElement(
      StaticRouter as never,
      /* basename makes Link hrefs absolute to the deploy path; location must
         carry the same prefix because Router strips the basename off it */
      { location: BASENAME + path, basename: BASENAME },
      createElement(Layout, null, createElement(Comp)),
    ),
  )

  // drop the default title and description, then inject per-route head tags
  let html = template.replace(/<title>[\s\S]*?<\/title>/, '')
  html = html.replace(/<meta name="description"[^>]*>/, '')
  html = html.replace(
    '</head>',
    '    ' + headTags(title, description, path, indexable) + '\n  </head>',
  )
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<\/body>/,
    '<div id="root">' + body + '</div>\n  </body>',
  )
  if (html.indexOf('<div id="root">' + body + '</div>') === -1) {
    html = html.replace('<div id="root"></div>', '<div id="root">' + body + '</div>')
  }
  return html
}

let count = 0

for (const meta of pages) {
  const Comp = ROUTES[meta.path]
  if (Comp === undefined) continue

  const html = renderPage(meta.path, Comp, meta.title, meta.description)
  const dir = meta.path === '/' ? 'dist' : join('dist', meta.path.slice(1))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html, 'utf-8')
  count += 1
}

// 404 fallback for unknown paths
writeFileSync(
  join('dist', '404.html'),
  renderPage(
    '/404',
    NotFound,
    'Page not found - JustJayDev',
    'That page does not exist on justjaydev-v1.',
    false,
  ),
  'utf-8',
)

console.log('prerendered ' + count + ' routes + 404 fallback')
/* ---------- sitemap.xml + robots.txt ---------- */
const today = new Date().toISOString().slice(0, 10)
const urls = pages
  .map((p) => {
    const loc = SITE + (p.path === '/' ? '/' : p.path)
    const priority = p.path === '/' ? '1.0' : '0.8'
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>weekly</changefreq>',
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  })
  .join('\n')

writeFileSync(
  join('dist', 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls +
    '\n</urlset>\n',
  'utf-8',
)

writeFileSync(
  join('dist', 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n',
  'utf-8',
)

console.log('sitemap + robots written (' + pages.length + ' urls)')

/*
 * GitHub Pages has no server-side rewrite, so deep links like /projects
 * would 404 on a hard refresh. Copying index.html into each route folder
 * lets Pages serve the SPA shell for every route.
 */
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const routes = ['projects', 'games', 'devlog', 'lab', 'about', 'links']
const dist = 'dist'
const shell = join(dist, 'index.html')

for (const r of routes) {
  mkdirSync(join(dist, r), { recursive: true })
  copyFileSync(shell, join(dist, r, 'index.html'))
}

// 404 fallback keeps the SPA for unknown paths too
const html = readFileSync(shell, 'utf8')
writeFileSync(join(dist, '404.html'), html)

console.log('spa routes generated: ' + routes.length)

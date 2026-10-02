import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SeoHead, { applyHead } from './components/SeoHead'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Games from './pages/Games'
import Devlog from './pages/Devlog'
import Lab from './pages/Lab'
import About from './pages/About'
import Links from './pages/Links'
import NotFound from './pages/NotFound'
import { pages } from './data/content'

/* used by the prerender step to bake head tags into static HTML */
export const routeMeta = pages

export { applyHead }

export default function App() {
  const home = pages[0]
  const notFound = {
    title: 'Page not found - JustJayDev',
    description: 'That page does not exist on justjaydev-v1.',
  }

  const head = (m: { title: string; description: string; path: string }) => (
    <SeoHead title={m.title} description={m.description} path={m.path} />
  )

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<>{head(home)}<Home /></>} />
        {pages.slice(1).map((p) => {
          const Comp = {
            '/projects': Projects,
            '/games': Games,
            '/devlog': Devlog,
            '/lab': Lab,
            '/about': About,
            '/links': Links,
          }[p.path]
          if (!Comp) return null
          return (
            <Route
              key={p.path}
              path={p.path}
              element={
                <>
                  {head(p)}
                  <Comp />
                </>
              }
            />
          )
        })}
        <Route path="*" element={<>{head({ ...notFound, path: '/404' })}<NotFound /></>} />
      </Routes>
    </Layout>
  )
}

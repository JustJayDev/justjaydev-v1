/*
 * SINGLE SOURCE OF TRUTH for every page on justjaydev-v1.
 *
 * HARD RULE: nothing here may be invented. Every string below is something
 * Jay has explicitly given. If a fact is missing, the array stays empty and
 * the page renders an honest empty state instead of filler.
 */

/* ---------- identity (given by Jay) ---------- */
export const identity = {
  name: 'Jay Kumar',
  handle: 'JustJayDev',
  location: 'India',
  tagline: "Mobile gamer with a builder's mind",
  motto: 'A King Never Wavers',
  creed: 'The definition of victory.',
  builtOn: 'Phone',
  mainGame: 'Free Fire Max',
  builtFromScratch: true,
} as const

/* ---------- routes + per-page SEO ---------- */
export interface PageMeta {
  path: string
  nav: string
  title: string
  description: string
}

export const pages: PageMeta[] = [
  {
    path: '/',
    nav: 'Home',
    title: 'JustJayDev - Mobile gamer with a builder\'s mind',
    description:
      'Jay Kumar (JustJayDev). Mobile gamer who builds on his phone. Played site, games and an honest build queue.',
  },
  {
    path: '/projects',
    nav: 'Projects',
    title: 'Build Queue - JustJayDev',
    description:
      'The queue of what Jay Kumar plans to build from scratch. Nothing shipped yet.',
  },
  {
    path: '/games',
    nav: 'Games',
    title: 'Games - JustJayDev',
    description: 'Games Jay Kumar actually plays, including Free Fire Max.',
  },
  {
    path: '/devlog',
    nav: 'Devlog',
    title: 'Devlog - JustJayDev',
    description: 'Short, honest notes from the build. Newest entry first.',
  },
  {
    path: '/lab',
    nav: 'Lab',
    title: 'Lab - JustJayDev',
    description:
      'A space for AI and automation experiments. No experiments published yet.',
  },
  {
    path: '/about',
    nav: 'About',
    title: 'About - JustJayDev',
    description:
      'Jay Kumar, known as JustJayDev. Mobile gamer who builds on his phone.',
  },
  {
    path: '/links',
    nav: 'Links',
    title: 'Links - JustJayDev',
    description: 'Every place to find JustJayDev.',
  },
]

/* ---------- build queue (planned only) ---------- */
export interface BuildIdea {
  id: string
  title: string
  blurb: string
}

/* Empty until Jay gives real ideas. Intentionally empty. */
export const buildQueue: BuildIdea[] = []

/* Nothing has been shipped yet. Explicit, so no page implies otherwise. */
export const shippedCount = 0

/* ---------- games (given by Jay) ---------- */
export interface GameTitle {
  id: string
  name: string
  platform: string
  note: string
}

export const games: GameTitle[] = [
  {
    id: 'ffmax',
    name: 'Free Fire Max',
    platform: 'Mobile',
    note: 'Main game. Grinder.',
  },
]

/* ---------- devlog (real, already-happened) ---------- */
export interface DevlogEntry {
  id: string
  title: string
  date: string
  body: string
}

export const devlog: DevlogEntry[] = [
  {
    id: 'v1-start',
    title: 'Started building my new website, v1',
    date: '2026-10-02',
    body: 'First entry. Everything on this site gets built from scratch, on a phone.',
  },
]

/* ---------- lab (empty until real experiments exist) ---------- */
export interface LabExperiment {
  id: string
  title: string
  blurb: string
  status: string
}

export const experiments: LabExperiment[] = []

export const labIntro =
  'A place for AI and automation experiments. Nothing published here yet - when something works, it shows up.'

/* ---------- links ---------- */
export interface LinkItem {
  id: string
  label: string
  handle: string
  href: string
}

export const links: LinkItem[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: 'JustJayDev',
    href: 'https://github.com/JustJayDev',
  },
]

/* ---------- about (facts only) ---------- */
export const aboutFacts: { k: string; v: string }[] = [
  { k: 'NAME', v: identity.name },
  { k: 'HANDLE', v: '@' + identity.handle },
  { k: 'BASED IN', v: identity.location },
  { k: 'PLAYS', v: identity.mainGame },
  { k: 'BUILDS ON', v: identity.builtOn },
]

/*
 * SINGLE SOURCE OF TRUTH for every page on justjaydev-v1.
 *
 * HARD RULE: nothing here may be invented. Every string below is something
 * Jay has explicitly given. If a fact is missing, the array stays empty and
 * the page renders an honest empty state instead of filler.
 */

/* ---------- identity (given by Jay) ---------- */
export const identity = {
  name: '@JustJayDev',
  handle: 'JustJayDev',
  location: '',
  tagline: "Mobile gamer with a builder's mind",
  motto: 'A King Never Wavers',
  creed: 'The definition of victory.',
  builtOn: 'Phone',
  mainGame: 'Free Fire Max',
  builtFromScratch: true,
} as const

/* Initials used for the avatar monogram until Jay supplies a real photo. */
export const avatar = {
  /* empty string = no photo yet, the monogram renders instead */
  photo: '' as string,
  initials: 'JJ',
  alt: 'Profile photo of @JustJayDev',
} as const

/* ---------- contact ---------- */
export const contact = {
  /* empty = no address given yet; the slot renders as an honest empty state */
  email: '' as string,
  /* what the slot shows before an email exists */
  emailPending: 'not added yet',
} as const

/* ---------- routes + per-page SEO ---------- */
export interface PageMeta {
  path: string
  nav: string
  title: string
  description: string
  /* true = the route still works, prerenders and appears in the sitemap, it is
     just kept out of the nav until it has real content to show */
  navHidden?: boolean
}

export const pages: PageMeta[] = [
  {
    path: '/',
    nav: 'Home',
    title: 'JustJayDev - Mobile gamer with a builder\'s mind',
    description:
      '@JustJayDev. Mobile gamer who builds on his phone. Played site, games and an honest build queue.',
  },
  {
    path: '/projects',
    nav: 'Projects',
    title: 'Build Queue - JustJayDev',
    description:
      'The queue of what @JustJayDev plans to build from scratch. Nothing shipped yet.',
  },
  {
    path: '/games',
    nav: 'Games',
    title: 'Games - JustJayDev',
    description:
      'Games @JustJayDev actually plays. Free Fire Max, the main one, with a screenshot slot, rank and achievements added when he has them.',
  },
  {
    path: '/devlog',
    nav: 'Devlog',
    title: 'Devlog - JustJayDev',
    description:
      'Short, honest build notes from @JustJayDev. Progress on justjaydev-v1, newest entry first, nothing polished into looking finished.',
  },
  {
    path: '/lab',
    nav: 'Lab',
    title: 'Lab - JustJayDev',
    description:
      'A space for AI and automation experiments. No experiments published yet.',
    /* no experiments exist yet, so the tab is hidden until one does. The route
       still resolves, prerenders and is listed in the sitemap. */
    navHidden: true,
  },
  {
    path: '/about',
    nav: 'About',
    title: 'About - JustJayDev',
    description:
      '@JustJayDev. Mobile gamer who builds on his phone.',
  },
  {
    path: '/links',
    nav: 'Links',
    title: 'Links - JustJayDev',
    description:
      'Every place to find JustJayDev: GitHub, and the social slots that have not been filled in yet.',
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

/* ---------- games (given by Jay) ----------
 *
 * TO ADD A GAME: append one object to this array. That is the entire change -
 * the Games page, its slots and the empty states all read from here.
 */
export interface GameTitle {
  id: string
  name: string
  platform: string
  note: string
  /* '' = no screenshot yet, the blueprint banner shows instead */
  image: string
  imageAlt: string
  /* '' = no rank given yet, the slot renders as an empty state */
  rank: string
  /* [] = none given yet, the slot renders as an empty state */
  achievements: { id: string; label: string; detail: string }[]
}

export const games: GameTitle[] = [
  {
    id: 'ffmax',
    name: 'Free Fire Max',
    platform: 'Mobile',
    note: 'Main game. Grinder.',
    image: '',
    imageAlt: 'Free Fire Max gameplay screenshot',
    rank: '',
    achievements: [],
  },
]

/* ---------- gamer card + 3D avatar (round 3) ----------
 *
 * PRIVACY: gamer details only. Age, height, weight, real full name and location
 * are deliberately absent here and are never added to these objects, the
 * hotspots, or the assistant facts file.
 *
 * Every '' below is an honest empty state on the page, never invented content.
 */
export const gamer = {
  handle: '@' + identity.handle,
  /* what he plays on; he builds and plays on a phone */
  device: identity.builtOn,
  deviceNote: 'Phone',
  mainGame: identity.mainGame,
  mainGameNote: 'Main game. Grinder.',
  /* '' = he has not stated a role yet */
  role: '' as string,
  rolePending: 'not added yet',
  /* '' = no rank given yet */
  rank: '' as string,
  rankPending: 'rank not added yet',
  achievements: [] as string[],
  achievementsPending: 'no achievements added yet',
  /* what he is building right now: this site, which is a real, stated fact */
  building: 'justjaydev-v1',
  buildingNote: 'This site. Built from scratch, on a phone.',
} as const

/*
 * 3D avatar.
 *
 * `modelUrl` is the ONE thing Jay has to supply. While it is empty the About
 * page shows the static poster and a clear drop-in instruction, and no 3D code
 * is downloaded at all - not even the viewer.
 *
 * TO ADD THE MODEL: export a stylized GLB under 2 MB and save it as
 *   public/models/avatar.glb
 * then set modelUrl to '/justjaydev-v1/models/avatar.glb'.
 */
export const avatar3d = {
  modelUrl: '' as string,
  /* hard ceiling so a heavy file can never tank the page */
  maxBytes: 2 * 1024 * 1024,
  /* shown in place of the model, and quoted in the drop-in hint */
  expectedPath: 'public/models/avatar.glb',
  expectedUrl: '/justjaydev-v1/models/avatar.glb',
  posterAlt:
    'Stylized 3D avatar placeholder for JustJayDev. No 3D model uploaded yet.',
  hint:
    'No 3D model yet. Drop a .glb under 2 MB at public/models/avatar.glb and it appears here automatically.',
  /* rotation speed of the idle spin, degrees per second */
  spinDegPerSec: 14,
} as const

/*
 * Hotspots shown on the 3D avatar. GAMER DETAILS ONLY - the same facts as the
 * gamer card, positioned on the model. A hotspot with an empty value renders the
 * pending label instead of a guess.
 *
 * x / y are percentages across the avatar frame.
 */
export interface Hotspot {
  id: string
  label: string
  x: number
  y: number
  value: string
  pending: string
}

export const avatarHotspots: Hotspot[] = [
  { id: 'handle', label: 'HANDLE', x: 50, y: 20, value: gamer.handle, pending: 'not added yet' },
  { id: 'game', label: 'MAIN GAME', x: 22, y: 42, value: gamer.mainGame, pending: 'not added yet' },
  { id: 'role', label: 'ROLE', x: 78, y: 46, value: gamer.role, pending: gamer.rolePending },
  { id: 'rank', label: 'RANK', x: 26, y: 68, value: gamer.rank, pending: gamer.rankPending },
  { id: 'device', label: 'DEVICE', x: 74, y: 70, value: gamer.deviceNote, pending: 'not added yet' },
  { id: 'building', label: 'BUILDING', x: 50, y: 86, value: gamer.building, pending: 'not added yet' },
]

/* ---------- now (home) ----------
 *
 * Two honest lines: what he is playing and what he is building. Empty strings
 * render as a pending empty state, never as invented filler.
 */
export const now = {
  playing: identity.mainGame,
  playingNote: 'Main game. Grinder.',
  building: gamer.building,
  buildingNote: gamer.buildingNote,
  pending: 'not added yet',
} as const

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

/* Slots for socials Jay has not provided yet. Rendered as honest empty rows,
   never faked out with a guessed URL. */
export const reservedSlots: { id: string; label: string }[] = [
  { id: 'x', label: 'X / Twitter' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'discord', label: 'Discord' },
]

/* ---------- about (facts only) ---------- */
/* PRIVACY GUARD: any slot whose value is empty is dropped from the list, so a
   row can never reappear with an invented or stale value. Real full name and
   exact location are deliberately absent. Only the handle is shown. */
export const aboutFacts: { k: string; v: string }[] = [
  { k: 'HANDLE', v: '@' + identity.handle },
  { k: 'PLAYS', v: identity.mainGame },
  { k: 'BUILDS ON', v: identity.builtOn },
].filter((row) => row.v.trim() !== '')

/* ---------- assistant widget ----------
 *
 * `workerUrl` is the ONLY value Jay has to paste in. While it stays empty the
 * widget renders "Assistant coming soon" and the rest of the site is unaffected.
 * Setup steps live in /worker/README-setup.md.
 */
export const assistant = {
  /* paste the deployed Worker URL, e.g. 'https://jj-assistant.<you>.workers.dev' */
  workerUrl: 'https://jj-assistant.justjaydev.workers.dev' as string,
  factsNote: 'Answers only from approved facts about @JustJayDev.',
} as const

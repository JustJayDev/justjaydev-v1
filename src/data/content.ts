/*
 * CONTENT LAYER - single source of truth for every page.
 * Edit values here; pages import from this file only.
 * NOTE: project titles/descriptions below are PLACEHOLDERS. Replace with real work.
 */

export type Status = 'live' | 'building' | 'planned' | 'shipped'

export interface Project {
  slug: string
  index: string
  title: string
  status: Status
  year: string
  summary: string
  detail: string
  stack: string[]
  link?: string
  repo?: string
  variant: number
}

export const projects: Project[] = [
  {
    slug: 'this-site',
    index: '01',
    title: 'justjaydev-v1',
    status: 'live',
    year: '2026',
    summary: 'This site. Blueprint Terminal design system, built and deployed entirely from a phone.',
    detail:
      'React + TypeScript + Vite + Tailwind, deployed to GitHub Pages. No desktop, no laptop - every line authored and shipped from Android.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind'],
    link: 'https://justjaydev.github.io/justjaydev-v1/',
    variant: 0,
  },
  {
    slug: 'project-slot-02',
    index: '02',
    title: 'Project Slot 02',
    status: 'building',
    year: '2026',
    summary: 'Placeholder - replace with a real project title and one-line summary.',
    detail:
      'Placeholder description. Explain what it does, what problem it solves, and the interesting technical constraint you worked around.',
    stack: ['Slot', 'Slot'],
    variant: 1,
  },
  {
    slug: 'project-slot-03',
    index: '03',
    title: 'Project Slot 03',
    status: 'building',
    year: '2026',
    summary: 'Placeholder - replace with a real project title and one-line summary.',
    detail:
      'Placeholder description. Explain what it does, what problem it solves, and the interesting technical constraint you worked around.',
    stack: ['Slot', 'Slot'],
    variant: 2,
  },
  {
    slug: 'project-slot-04',
    index: '04',
    title: 'Project Slot 04',
    status: 'planned',
    year: '2026',
    summary: 'Placeholder - replace with a real project title and one-line summary.',
    detail:
      'Placeholder description. Explain what it does, what problem it solves, and the interesting technical constraint you worked around.',
    stack: ['Slot', 'Slot'],
    variant: 3,
  },
  {
    slug: 'project-slot-05',
    index: '05',
    title: 'Project Slot 05',
    status: 'planned',
    year: '2026',
    summary: 'Placeholder - replace with a real project title and one-line summary.',
    detail:
      'Placeholder description. Explain what it does, what problem it solves, and the interesting technical constraint you worked around.',
    stack: ['Slot', 'Slot'],
    variant: 4,
  },
]

export const statusMeta: Record<Status, { label: string; tone: string }> = {
  live: { label: 'live', tone: 'text-accent border-accent/40' },
  building: { label: 'building', tone: 'text-txt border-line' },
  planned: { label: 'planned', tone: 'text-dim border-line' },
  shipped: { label: 'shipped', tone: 'text-accent border-accent/40' },
}

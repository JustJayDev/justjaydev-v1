/*
 * Devlog entries - only real, already-happened events.
 * Newest first. Add an entry only when the thing it describes is true.
 */

export interface DevlogEntry {
  id: string
  title: string
  date: string
  body: string
}

export const devlog: DevlogEntry[] = [
  {
    id: 'v1-launch',
    title: 'v1 is live',
    date: '2026-10-04',
    body: 'Site designed, built and deployed from a phone. Blueprint Terminal look, cyan accent, no templates.',
  },
  {
    id: 'queue-opened',
    title: 'Build queue opened',
    date: '2026-10-04',
    body: 'Projects page started as an empty queue. Entries get added when a build is actually finished.',
  },
]

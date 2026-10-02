/*
 * CONTENT LAYER - single source of truth for every page.
 *
 * RULE: nothing in this file is invented. Only add entries Jay has
 * explicitly given. Empty arrays are valid and render an empty state -
 * that is intentional, not a bug.
 */

export type IdeaStatus = 'planned'

export interface BuildIdea {
  id: string
  title: string
  blurb: string
  status: IdeaStatus
}

export interface GameTitle {
  id: string
  name: string
  platform: string
  note: string
}

/* Build queue - planned ideas only. Empty until Jay supplies real ones. */
export const buildQueue: BuildIdea[] = []

/* Games Jay has actually stated he plays. No invented stats anywhere. */
export const games: GameTitle[] = [
  {
    id: 'ffmax',
    name: 'Free Fire Max',
    platform: 'Mobile',
    note: 'Main game. Grinder.',
  },
]

/* Nothing has shipped yet. Kept explicit so no page can imply otherwise. */
export const shippedCount = 0

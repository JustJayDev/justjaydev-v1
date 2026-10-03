/*
 * GamerCard - the compact stat card shown next to the avatar.
 *
 * SCREENSHOT-FRIENDLY BY DESIGN: a fixed, self-contained block with a high
 * contrast border, its own heading and monospace values, so a screenshot of this
 * card alone is readable and clearly says who it is about. It carries GAMER
 * DETAILS ONLY - handle, device, main game, role, rank, achievements, current
 * build. No age, height, weight, real full name or location.
 *
 * Every field with no value yet renders an honest pending label in italics.
 */
import { gamer } from '../data/content'

function Row({
  label,
  value,
  pending,
}: {
  label: string
  value: string
  pending: string
}) {
  const empty = value.trim() === ''
  return (
    <div className="gamer-row">
      <dt className="gamer-row-label">{label}</dt>
      <dd
        className={'gamer-row-value' + (empty ? ' is-empty' : '')}
        title={empty ? pending : undefined}
      >
        {empty ? pending : value}
      </dd>
    </div>
  )
}

export default function GamerCard() {
  const achievements =
    gamer.achievements.length > 0 ? gamer.achievements.join(', ') : ''

  return (
    <section className="gamer-card" aria-labelledby="gamer-card-h">
      {/* the corner brackets + heading make the card read as a finished object
          when it is screenshotted on its own */}
      <header className="gamer-card-head">
        <p className="mono-label">// player card</p>
        <h2 id="gamer-card-h" className="gamer-card-name">
          {gamer.handle}
        </h2>
      </header>

      <dl className="gamer-card-rows">
        <Row label="DEVICE" value={gamer.deviceNote} pending="not added yet" />
        <Row label="MAIN GAME" value={gamer.mainGame} pending="not added yet" />
        <Row label="GAME NOTE" value={gamer.mainGameNote} pending="not added yet" />
        <Row label="ROLE" value={gamer.role} pending={gamer.rolePending} />
        <Row label="RANK" value={gamer.rank} pending={gamer.rankPending} />
        <Row label="ACHIEVEMENTS" value={achievements} pending={gamer.achievementsPending} />
        <Row label="BUILDING" value={gamer.building} pending="not added yet" />
      </dl>

      <p className="gamer-card-foot">
        <span className="gamer-card-foot-label">NOW BUILDING</span>
        {gamer.buildingNote}
      </p>
    </section>
  )
}
import PageHead from '../components/PageHead'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import BlueprintBanner from '../components/BlueprintBanner'
import { games } from '../data/content'

/*
 * A small honest slot: shows a real value when Jay has given one, otherwise it
 * says so. Never invents a rank, a stat or an achievement.
 */
function Slot({
  label,
  value,
  pending,
}: {
  label: string
  value: string
  pending: string
}) {
  const filled = value.trim() !== ''
  return (
    <div className="border border-dashed border-line px-3 py-2">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">{label}</p>
      <p
        className={
          filled
            ? 'mt-0.5 font-mono text-xs text-txt'
            : 'mt-0.5 font-mono text-xs italic text-dim'
        }
      >
        {filled ? value : pending}
      </p>
    </div>
  )
}

export default function Games() {
  return (
    <div>
      <PageHead
        label="// loadout"
        title="Games"
        lede="What I actually play. No invented stats or ranks."
      />

      {games.length === 0 ? (
        <EmptyState label="no titles" title="Nothing listed yet." />
      ) : (
        <ul className="mt-6 space-y-6">
          {games.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.05}>
              <li className="panel corner-brackets">
                {/* banner: Jay's own screenshot once provided, blueprint slot until then.
                    No official game artwork or logos are used anywhere. */}
                {g.image !== '' ? (
                  <div className="img-slot border-b border-line">
                    <img
                      src={g.image}
                      alt={g.imageAlt}
                      loading="lazy"
                      decoding="async"
                      width={1280}
                      height={720}
                    />
                  </div>
                ) : (
                  <div className="border-b border-line">
                    <BlueprintBanner title={g.name} />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-bold">{g.name}</h2>
                    <span className="shrink-0 border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-dim">
                      {g.platform}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dim">{g.note}</p>

                  {/* rank + achievements: real values when given, empty states otherwise */}
                  <div className="mt-4">
                    <Slot label="rank" value={g.rank} pending="not added yet" />
                  </div>

                  <div className="mt-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                      achievements
                    </p>
                    {g.achievements.length === 0 ? (
                      <p className="mt-1.5 border border-dashed border-line px-3 py-2 font-mono text-xs italic text-dim">
                        none added yet
                      </p>
                    ) : (
                      <ul className="mt-1.5 space-y-1.5">
                        {g.achievements.map((a) => (
                          <li key={a.id} className="border border-line px-3 py-2">
                            <p className="font-mono text-xs text-txt">{a.label}</p>
                            {a.detail !== '' && (
                              <p className="mt-0.5 text-xs text-dim">{a.detail}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      )}

      <Reveal>
        <p className="mt-8 border border-dashed border-line p-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          more titles get added as they come up
        </p>
      </Reveal>
    </div>
  )
}
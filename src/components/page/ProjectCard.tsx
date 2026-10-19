import type { Node } from '../../data/portfolio'
import { openInGraph } from '../../hooks/navigation'
import { Badge, body, card, chip, muted, primaryButton, secondaryButton, strong, textLink } from './ui'

export function ProjectCard({ project: p }: { project: Node }) {
  const isStreamlit = p.links?.live?.includes('streamlit.app')
  return (
    <article className={card}>
      {p.media &&
        (p.media.endsWith('.mp4') ? (
          <video
            src={p.media}
            aria-label={`${p.label} demo video`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08]"
          />
        ) : (
          <img
            src={p.media}
            alt={`${p.label} demo`}
            loading="lazy"
            className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08]"
          />
        ))}
      {p.media && (
        <p className={`mb-5 mt-1.5 text-xs ${muted}`}>{p.mediaNote ?? ''}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={`text-lg font-semibold sm:text-xl ${strong}`}>{p.label}</h3>
        {!p.links && <Badge tone="amber">Client project · in production</Badge>}
      </div>
      <p className={`mt-2 text-sm leading-relaxed ${body}`}>{p.description}</p>

      {p.story && (
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          {(
            [
              ['Problem', p.story.problem],
              ['Key decision', p.story.decision],
              ['Outcome', p.story.outcome],
            ] as const
          ).map(([term, text]) => (
            <div
              key={term}
              className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {term}
              </dt>
              <dd className={`mt-1 leading-relaxed ${body}`}>{text}</dd>
            </div>
          ))}
        </dl>
      )}

      {p.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className={chip}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {p.links?.live && (
          <a href={p.links.live} target="_blank" rel="noreferrer" className={primaryButton}>
            Live demo
          </a>
        )}
        {p.links?.source && (
          <a href={p.links.source} target="_blank" rel="noreferrer" className={secondaryButton}>
            Source code
          </a>
        )}
        <button
          type="button"
          onClick={() => openInGraph(p.id)}
          className={`cursor-pointer text-sm ${textLink}`}
        >
          See it in 3D →
        </button>
      </div>
      {isStreamlit && (
        <p className={`mt-2 text-xs ${muted}`}>
          The demo may take ~30s to wake up on first visit.
        </p>
      )}
    </article>
  )
}

// Compact row for projects without a write-up yet
export function ProjectRow({ project: p }: { project: Node }) {
  return (
    <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
      <div className="flex shrink-0 items-center gap-2 sm:w-56">
        <span className={`font-semibold ${strong}`}>{p.label}</span>
        {p.status === 'in-progress' && <Badge tone="amber">In progress</Badge>}
      </div>
      <p className={`flex-1 text-sm ${body}`}>{p.description}</p>
      {p.links?.source && (
        <a href={p.links.source} target="_blank" rel="noreferrer" className={`text-sm ${textLink}`}>
          Source
        </a>
      )}
    </li>
  )
}

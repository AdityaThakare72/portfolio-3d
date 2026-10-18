import { useMemo, useState } from 'react'
import { matchJob } from '../../hooks/jobMatch'
import { useGraphStore } from '../../hooks/useGraphStore'
import { useView } from '../../hooks/useView'
import { body, card, muted, secondaryButton, strong, textLink } from './ui'

// Paste a job description, see which of the listed skills it mentions and
// the projects that show them
export default function JobMatch() {
  const [text, setText] = useState('')
  const result = useMemo(() => (text.trim() ? matchJob(text) : null), [text])

  const showInGraph = () => {
    if (!result) return
    useGraphStore.getState().setFilter({
      kind: 'ids',
      label: 'Job description match',
      ids: [...result.skills, ...result.evidence.map((e) => e.project)].map((n) => n.id),
    })
    useView.getState().setView('graph')
  }

  return (
    <div id="match" className={`${card} scroll-mt-20`}>
      <h3 className={`text-lg font-semibold ${strong}`}>Hiring for a role?</h3>
      <p className={`mt-1 text-sm ${muted}`}>
        Paste the job description to see which of my skills it mentions and the
        projects where I've used them.
      </p>
      <label htmlFor="jd" className="sr-only">
        Job description
      </label>
      <textarea
        id="jd"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="e.g. We're looking for a Data Scientist with Python, RAG, LangChain and Docker experience…"
        className="mt-4 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <p className={`mt-1 text-xs ${muted}`}>
        Simple keyword match in your browser — nothing is sent anywhere. It only
        knows the skills listed on this page.
      </p>

      {result && (
        <div className="mt-5" aria-live="polite">
          {result.skills.length === 0 ? (
            <p className={`text-sm ${body}`}>
              No skills from my list found in this text. Try pasting the
              requirements section.
            </p>
          ) : (
            <>
              <p className={`text-sm font-semibold ${strong}`}>
                {result.skills.length} of my skills appear in this description
                {result.categories.length > 0 && (
                  <span className={`font-normal ${muted}`}>
                    {' '}
                    · also mentions {result.categories.map((c) => c.label).join(', ')}
                  </span>
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.skills.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-emerald-500/40 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300"
                  >
                    ✓ {s.label}
                  </span>
                ))}
              </div>
              {result.evidence.length > 0 && (
                <>
                  <h4 className={`mt-5 text-xs font-semibold uppercase tracking-wider ${muted}`}>
                    Where I've used them
                  </h4>
                  <ul className={`mt-2 space-y-1.5 text-sm ${body}`}>
                    {result.evidence.map(({ project, skills }) => (
                      <li key={project.id}>
                        <span className={`font-semibold ${strong}`}>{project.label}</span>
                        <span className={muted}> — {skills.map((s) => s.label).join(', ')}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={showInGraph} className={`cursor-pointer ${secondaryButton}`}>
                  Highlight these in the 3D graph →
                </button>
                <button
                  type="button"
                  onClick={() => setText('')}
                  className={`cursor-pointer text-sm ${textLink}`}
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'

// Shared building blocks for the readable page. Every color has a light
// and a dark variant; the page follows the visitor's OS theme or toggle.

export const card =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-slate-900/50 dark:shadow-none sm:p-6'

export const chip =
  'rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'

export const muted = 'text-slate-600 dark:text-slate-400'
export const body = 'text-slate-700 dark:text-slate-300'
export const strong = 'text-slate-900 dark:text-white'

export const primaryButton =
  'inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500 dark:bg-sky-400 dark:text-gray-950 dark:hover:bg-sky-300'

export const secondaryButton =
  'inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-600 hover:text-sky-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-400'

export const textLink =
  'font-medium text-sky-700 underline-offset-4 hover:underline dark:text-sky-400'

export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string
  title: string
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 py-10 sm:py-14">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-400">
        {title}
      </h2>
      {intro && <p className={`mt-2 max-w-2xl text-sm ${muted}`}>{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Badge({ tone, children }: { tone: 'amber' | 'sky'; children: ReactNode }) {
  const tones = {
    amber:
      'border-amber-500/30 bg-amber-100 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300',
    sky: 'border-sky-500/30 bg-sky-100 text-sky-800 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300',
  }
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

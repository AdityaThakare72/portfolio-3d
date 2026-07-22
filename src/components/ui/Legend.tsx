import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGraphStore } from '../../hooks/useGraphStore'

const rows = [
  {
    label: 'Project',
    icon: (
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute h-4 w-4 rounded-full border border-sky-400/60" />
        <span className="h-2 w-2 rounded-full bg-sky-400" />
      </span>
    ),
  },
  {
    label: 'Skill Category',
    icon: (
      <span className="flex h-4 w-4 items-center justify-center">
        <span className="h-2.5 w-2.5 rotate-45 bg-violet-400" />
      </span>
    ),
  },
  {
    label: 'Individual Skill',
    icon: (
      <span className="flex h-4 w-4 items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      </span>
    ),
  },
  {
    label: 'Blog Post',
    icon: (
      <span className="flex h-4 w-4 items-center justify-center">
        <span
          className="h-3 w-3 bg-pink-400"
          style={{
            clipPath:
              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      </span>
    ),
  },
  {
    label: 'Certification',
    icon: (
      <span className="flex h-4 w-4 items-center justify-center">
        <span
          className="h-3 w-3 bg-emerald-400"
          style={{
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          }}
        />
      </span>
    ),
  },
  {
    label: 'Experience / Education',
    icon: (
      <span className="flex h-4 w-4 items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-amber-400" />
      </span>
    ),
  },
]

export default function Legend() {
  const selectedNode = useGraphStore((s) => s.selectedNode)
  // Collapsed by default on small screens — it eats too much viewport there
  const [open, setOpen] = useState(
    () =>
      typeof window === 'undefined' ||
      window.matchMedia('(min-width: 640px)').matches,
  )

  return (
    <motion.div
      animate={{ opacity: selectedNode ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-4 left-4 z-10 sm:bottom-6 sm:left-6"
      style={{ pointerEvents: selectedNode ? 'none' : 'auto' }}
    >
      {open ? (
        <div
          className="rounded-xl border border-white/[0.08] px-4 py-3 backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}
        >
          <div className="mb-1 flex items-center justify-between gap-6">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Legend
            </span>
            <button
              type="button"
              aria-label="Collapse legend"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-slate-500 transition hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center gap-2.5">
                {r.icon}
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-full border border-white/[0.08] px-3.5 py-1.5 text-xs text-slate-300 backdrop-blur-xl transition hover:text-white"
          style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}
        >
          Legend
        </button>
      )}
    </motion.div>
  )
}

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { COLORS, dim, nodes, type NodeType } from '../../data/portfolio'
import {
  useGraphStore,
  type Cluster,
  type Filter,
} from '../../hooks/useGraphStore'
import { sameFilter } from '../../hooks/focus'

const count = (types: NodeType[]) =>
  nodes.filter((n) => types.includes(n.type)).length

const categories = nodes.filter((n) => n.type === 'category')

interface Row {
  label: string
  types: NodeType[]
  cluster: Cluster
  count: number
  icon: ReactNode
}

const rows: Row[] = [
  {
    label: 'Projects',
    types: ['project'],
    cluster: 'projects',
    count: count(['project']),
    icon: (
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute h-4 w-4 rounded-full border border-sky-400/60" />
        <span className="h-2 w-2 rounded-full bg-sky-400" />
      </span>
    ),
  },
  {
    label: 'Skills',
    types: ['category', 'skill'],
    cluster: 'skills',
    count: count(['skill']),
    icon: (
      <span className="flex h-4 w-4 items-center justify-center gap-0.5">
        <span className="h-2 w-2 rotate-45 bg-violet-400" />
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dim(COLORS.category) }}
        />
      </span>
    ),
  },
  {
    label: 'Blog posts',
    types: ['blog'],
    cluster: 'blogs',
    count: count(['blog']),
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
    label: 'Certifications',
    types: ['cert'],
    cluster: 'certs',
    count: count(['cert']),
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
    label: 'Experience · Teaching · Education',
    types: ['info'],
    cluster: 'info',
    count: count(['info']),
    icon: (
      <span className="flex h-4 w-4 items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-amber-400" />
      </span>
    ),
  },
]

function filterLabel(f: Filter) {
  if (f.kind === 'category') {
    return categories.find((c) => c.id === f.id)?.label ?? ''
  }
  return rows.find((r) => r.types.join() === f.types.join())?.label ?? ''
}

// Look at a category from outside the graph, so its skills and the
// projects around it stay in frame
function flyToCategory(id: string) {
  const node = categories.find((c) => c.id === id)
  if (!node) return
  const [x, y, z] = node.position
  const len = Math.hypot(x, y, z) || 1
  const d = 12
  useGraphStore
    .getState()
    .setCameraTarget(node.position, [(x / len) * d, (y / len) * d + 2, (z / len) * d])
}

export default function Legend() {
  const selectedNode = useGraphStore((s) => s.selectedNode)
  const filter = useGraphStore((s) => s.filter)
  const setFilter = useGraphStore((s) => s.setFilter)
  const setPreviewFilter = useGraphStore((s) => s.setPreviewFilter)
  const flyToCluster = useGraphStore((s) => s.flyToCluster)
  // Collapsed by default on small screens — it eats too much viewport there
  const [open, setOpen] = useState(
    () =>
      typeof window === 'undefined' ||
      window.matchMedia('(min-width: 640px)').matches,
  )

  // Click locks a filter (or clears it when clicked again); hover previews
  const choose = (f: Filter, fly: () => void) => {
    setPreviewFilter(null)
    if (sameFilter(f, filter)) {
      setFilter(null)
      return
    }
    setFilter(f)
    fly()
  }
  const preview = (f: Filter | null) => setPreviewFilter(f)

  const itemClass = (f: Filter) =>
    `flex w-full cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1 text-left transition hover:bg-white/5 hover:text-white ${
      sameFilter(f, filter) ? 'bg-white/10 text-white' : ''
    }`

  return (
    <motion.div
      animate={{ opacity: selectedNode ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-4 left-4 z-10 sm:bottom-6 sm:left-6"
      style={{ pointerEvents: selectedNode ? 'none' : 'auto' }}
    >
      {open ? (
        <div
          className="max-w-[calc(100vw-2rem)] rounded-xl border border-white/[0.08] px-3 py-3 backdrop-blur-xl sm:w-64"
          style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}
          onMouseLeave={() => preview(null)}
        >
          <div className="mb-1 flex items-center justify-between gap-6 px-1.5">
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

          {filter && (
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="mb-2 ml-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-300 transition hover:bg-sky-400/20"
            >
              Showing: {filterLabel(filter)}
              <span aria-hidden>✕</span>
              <span className="sr-only">Clear filter</span>
            </button>
          )}

          <ul className="space-y-0.5 text-xs text-slate-300">
            {rows.map((r) => {
              const f: Filter = { kind: 'type', types: r.types }
              return (
                <li key={r.label}>
                  <button
                    type="button"
                    aria-pressed={sameFilter(f, filter)}
                    onMouseEnter={() => preview(f)}
                    onFocus={() => preview(f)}
                    onBlur={() => preview(null)}
                    onClick={() => choose(f, () => flyToCluster(r.cluster))}
                    className={itemClass(f)}
                  >
                    {r.icon}
                    <span className="flex-1">{r.label}</span>
                    <span className="tabular-nums text-slate-500">{r.count}</span>
                  </button>
                  {r.cluster === 'skills' && (
                    <div className="mb-1 ml-7 mt-1 flex flex-wrap gap-1">
                      {categories.map((c) => {
                        const cf: Filter = { kind: 'category', id: c.id }
                        const active = sameFilter(cf, filter)
                        return (
                          <button
                            key={c.id}
                            type="button"
                            aria-pressed={active}
                            onMouseEnter={() => preview(cf)}
                            onFocus={() => preview(cf)}
                            onBlur={() => preview(null)}
                            onClick={() => choose(cf, () => flyToCategory(c.id))}
                            className={`cursor-pointer rounded-full border px-2 py-0.5 text-[10px] transition ${
                              active
                                ? 'border-violet-400 bg-violet-400/20 text-white'
                                : 'border-violet-400/30 text-slate-300 hover:border-violet-400 hover:text-white'
                            }`}
                          >
                            {c.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-2 px-1.5 text-[10px] text-slate-400">
            Hover to preview · click to filter
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-full border border-white/[0.08] px-3.5 py-1.5 text-xs text-slate-300 backdrop-blur-xl transition hover:text-white"
          style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}
        >
          {filter ? `Legend · ${filterLabel(filter)}` : 'Legend'}
        </button>
      )}
    </motion.div>
  )
}

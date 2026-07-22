import { AnimatePresence, motion } from 'framer-motion'
import { edges, nodeById, type Node } from '../../data/portfolio'
import { useGraphStore, deselect } from '../../hooks/useGraphStore'

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
      {children}
    </span>
  )
}

function ProjectContent({ node }: { node: Node }) {
  return (
    <>
      {node.tags?.[0] && (
        <span className="mb-3 inline-block rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-400">
          {node.tags[0]}
        </span>
      )}
      <h2 className="text-2xl font-bold text-white">{node.label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {node.description}
      </p>
      {node.tags && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {node.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        {node.links ? (
          <>
            {node.links.live && (
              <a
                href={node.links.live}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-sky-300"
              >
                Live Demo
              </a>
            )}
            {node.links.source && (
              <a
                href={node.links.source}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-sky-400 hover:text-sky-400"
              >
                Source Code
              </a>
            )}
          </>
        ) : (
          <span className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-300">
            Client Project
          </span>
        )}
      </div>
    </>
  )
}

function CategoryContent({ node }: { node: Node }) {
  const skills = edges
    .filter((e) => e.source === node.id)
    .map((e) => nodeById.get(e.target))
    .filter((n): n is Node => n?.type === 'skill')
  const projects = edges
    .filter((e) => e.target === node.id)
    .map((e) => nodeById.get(e.source))
    .filter((n): n is Node => n?.type === 'project')

  return (
    <>
      <h2 className="text-2xl font-bold text-white">{node.label}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {skills.length} skills in this category
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <Pill key={s.id}>{s.label}</Pill>
        ))}
      </div>
      {projects.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Connected Projects
          </h3>
          <ul className="space-y-1 text-sm">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    const store = useGraphStore.getState()
                    store.setSelectedNode(p.id)
                    store.setCameraTarget(p.position)
                  }}
                  className="cursor-pointer text-slate-300 transition-colors hover:text-sky-400"
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

function SkillContent({ node }: { node: Node }) {
  const category = edges
    .map((e) => (e.target === node.id ? nodeById.get(e.source) : undefined))
    .find((n) => n?.type === 'category')
  const projects = edges
    .filter((e) => e.target === node.id)
    .map((e) => nodeById.get(e.source))
    .filter((n): n is Node => n?.type === 'project')

  return (
    <>
      <h2 className="text-2xl font-bold text-white">{node.label}</h2>
      {category && (
        <p className="mt-1 text-sm text-slate-400">
          Part of <span className="text-slate-200">{category.label}</span>
        </p>
      )}
      {projects.length > 0 && (
        <p className="mt-3 text-sm text-slate-300">
          Used in: {projects.map((p) => p.label).join(', ')}
        </p>
      )}
    </>
  )
}

function BlogContent({ node }: { node: Node }) {
  return (
    <>
      {node.tags && (
        <div className="mb-3 flex flex-wrap gap-2">
          {node.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-pink-400/10 px-3 py-1 text-xs font-medium text-pink-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-bold text-white">{node.label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {node.description}
      </p>
      {node.links?.live && (
        <a
          href={node.links.live}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-pink-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-pink-300"
        >
          Read on Medium
        </a>
      )}
    </>
  )
}

function CertContent({ node }: { node: Node }) {
  return (
    <>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-emerald-400">
        Certification
      </span>
      <h2 className="text-2xl font-bold text-white">{node.label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {node.description}
      </p>
      {node.links?.live && (
        <a
          href={node.links.live}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-emerald-300"
        >
          Verify Certificate
        </a>
      )}
    </>
  )
}

function InfoContent({ node }: { node: Node }) {
  return (
    <>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-amber-400">
        {node.id === 'experience' ? 'Experience' : 'Education'}
      </span>
      <h2 className="text-2xl font-bold text-white">{node.label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        {node.description}
      </p>
    </>
  )
}

export default function DetailPanel() {
  const selectedNode = useGraphStore((s) => s.selectedNode)
  const node = selectedNode ? nodeById.get(selectedNode) : undefined

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="pointer-events-none fixed right-0 top-0 z-20 flex h-full w-full items-center sm:w-[380px]"
        >
          <div
            className="pointer-events-auto relative max-h-[80vh] w-full overflow-y-auto border-l border-white/[0.08] p-6 backdrop-blur-2xl"
            style={{ backgroundColor: 'rgba(15,23,42,0.9)' }}
          >
            <button
              type="button"
              onClick={deselect}
              aria-label="Close panel"
              className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition-colors hover:text-white"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            {node.type === 'project' && <ProjectContent node={node} />}
            {node.type === 'category' && <CategoryContent node={node} />}
            {node.type === 'skill' && <SkillContent node={node} />}
            {node.type === 'blog' && <BlogContent node={node} />}
            {node.type === 'cert' && <CertContent node={node} />}
            {node.type === 'info' && <InfoContent node={node} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

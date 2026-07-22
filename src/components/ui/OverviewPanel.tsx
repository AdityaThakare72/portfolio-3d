import { AnimatePresence, motion } from 'framer-motion'
import { edges, nodeById, nodes, type Node } from '../../data/portfolio'
import { useGraphStore } from '../../hooks/useGraphStore'

const projects = nodes.filter((n) => n.type === 'project')
const certs = nodes.filter((n) => n.type === 'cert')
const blogs = nodes.filter((n) => n.type === 'blog')
const experience = nodeById.get('experience')
const education = [nodeById.get('edu-cdac'), nodeById.get('edu-sppu')].filter(
  (n): n is Node => !!n,
)
const skillGroups = nodes
  .filter((n) => n.type === 'category')
  .map((c) => ({
    category: c,
    skills: edges
      .filter((e) => e.source === c.id)
      .map((e) => nodeById.get(e.target))
      .filter((n): n is Node => n?.type === 'skill'),
  }))

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-sky-400">
        {title}
      </h3>
      {children}
    </section>
  )
}

export default function OverviewPanel() {
  const showOverview = useGraphStore((s) => s.showOverview)
  const setShowOverview = useGraphStore((s) => s.setShowOverview)

  return (
    <AnimatePresence>
      {showOverview && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 overflow-y-auto"
          style={{ backgroundColor: '#030712' }}
        >
          <div className="mx-auto max-w-3xl px-5 pb-20 pt-20">
            <button
              type="button"
              onClick={() => setShowOverview(false)}
              aria-label="Close overview"
              className="fixed right-4 top-16 z-50 rounded-full border border-white/10 p-2 text-slate-300 backdrop-blur transition hover:text-white sm:right-8"
              style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-center gap-5">
              <img
                src="/avatar.jpg"
                alt="Aditya Thakare"
                className="h-16 w-16 rounded-full border border-white/10 object-cover sm:h-20 sm:w-20"
              />
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Aditya Thakare
                </h2>
                <p className="text-sm text-sky-400 sm:text-base">
                  AI Engineer · Data Scientist · MLOps — Pune, Maharashtra
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-200">
              2+ years experience · 4 production GenAI/ML systems · 2,000+
              professionals trained across 10+ industry engagements
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/Aditya_Thakare_Resume.pdf"
                download
                className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-sky-300"
              >
                Download Resume
              </a>
              <a
                href="https://github.com/AdityaThakare72"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-sky-400 hover:text-sky-400"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/aditya-thakare72/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-sky-400 hover:text-sky-400"
              >
                LinkedIn
              </a>
              <a
                href="mailto:adityathakare72@gmail.com"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-sky-400 hover:text-sky-400"
              >
                Email
              </a>
            </div>

            <Section title="Projects">
              <div className="space-y-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-white/[0.06] p-5"
                    style={{ backgroundColor: 'rgba(15,23,42,0.5)' }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-lg font-semibold text-white">
                        {p.label}
                      </h4>
                      <div className="flex gap-3 text-sm">
                        {p.links?.live && (
                          <a
                            href={p.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-400 hover:underline"
                          >
                            Live
                          </a>
                        )}
                        {p.links?.source && (
                          <a
                            href={p.links.source}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-400 hover:underline"
                          >
                            Source
                          </a>
                        )}
                        {!p.links && (
                          <span className="text-amber-300">Client project</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {p.description}
                    </p>
                    {p.tags && (
                      <p className="mt-2 text-xs text-slate-400">
                        {p.tags.join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Experience">
              {experience && (
                <>
                  <p className="text-sm font-semibold text-white">
                    Data Scientist — {experience.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    {experience.description}
                  </p>
                </>
              )}
            </Section>

            <Section title="Skills">
              <div className="space-y-3">
                {skillGroups.map(({ category, skills }) => (
                  <p key={category.id} className="text-sm">
                    <span className="font-semibold text-slate-200">
                      {category.label}:
                    </span>{' '}
                    <span className="text-slate-400">
                      {skills.map((s) => s.label).join(', ')}
                    </span>
                  </p>
                ))}
              </div>
            </Section>

            <Section title="Certifications">
              <ul className="space-y-2">
                {certs.map((c) => (
                  <li key={c.id} className="text-sm text-slate-300">
                    {c.links?.live ? (
                      <a
                        href={c.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-sky-400"
                      >
                        {c.description}
                      </a>
                    ) : (
                      c.description
                    )}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Writing">
              <ul className="space-y-2">
                {blogs.map((b) => (
                  <li key={b.id} className="text-sm">
                    <a
                      href={b.links?.live}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-sky-400"
                    >
                      {b.label}
                    </a>
                    <span className="text-slate-500"> — Medium</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Education">
              <ul className="space-y-2">
                {education.map((e) => (
                  <li key={e.id} className="text-sm text-slate-300">
                    <span className="font-semibold text-slate-200">
                      {e.label}
                    </span>{' '}
                    — {e.description}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import {
  AVAILABILITY,
  HEADLINE,
  SUMMARY,
  edges,
  nodeById,
  nodes,
  type Node,
} from '../../data/portfolio'
import { teachingStats, workshops } from '../../data/workshops'
import { useTheme } from '../../hooks/useTheme'
import { useView } from '../../hooks/useView'
import JobMatch from './JobMatch'
import { ProjectCard, ProjectRow } from './ProjectCard'
import {
  Section,
  body,
  card,
  chip,
  muted,
  primaryButton,
  secondaryButton,
  strong,
  textLink,
} from './ui'

const projects = nodes.filter((n) => n.type === 'project')
// Shipped work with a full write-up leads; the rest follows compactly
const featured = projects.filter((p) => p.story)
const others = projects.filter((p) => !p.story)
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
const workshopYears = [...new Set(workshops.map((w) => w.year))].sort((a, b) => b - a)
const topTopics = [
  ...workshops
    .reduce((m, w) => m.set(w.topic, (m.get(w.topic) ?? 0) + 1), new Map<string, number>())
    .entries(),
]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([topic]) => topic)

const stats = [
  { value: '3+ years', label: 'as a Data Scientist' },
  { value: '4', label: 'deployed AI systems' },
  { value: '2,000+', label: 'students & faculty trained' },
  {
    value: teachingStats.workshops,
    label: `workshops at ${teachingStats.institutions} institutions`,
  },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com/AdityaThakare72' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-thakare72/' },
  { label: 'Email', href: 'mailto:adityathakare72@gmail.com' },
]

const sections = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
      className="cursor-pointer rounded-full p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        )}
      </svg>
    </button>
  )
}

function ExploreButton({ compact = false }: { compact?: boolean }) {
  const setView = useView((s) => s.setView)
  return (
    <button
      type="button"
      onClick={() => setView('graph')}
      className={
        compact
          ? 'cursor-pointer rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:opacity-90'
          : 'cursor-pointer rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90'
      }
    >
      {compact ? 'Explore in 3D' : 'Explore as a 3D neural network →'}
    </button>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#030712]/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#top"
          className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent"
        >
          AT.
        </a>
        <nav className="hidden items-center gap-5 md:flex" aria-label="Sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <span className="hidden sm:inline">
            <ExploreButton compact />
          </span>
          <a
            href="/Aditya_Thakare_Resume.pdf"
            download
            className="rounded-full bg-sky-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500 dark:bg-sky-400 dark:text-gray-950 dark:hover:bg-sky-300"
          >
            Resume
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="cursor-pointer rounded-md p-2 text-slate-600 md:hidden dark:text-slate-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-white/[0.06]"
          aria-label="Sections"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {s.label}
            </a>
          ))}
          <div className="px-3 py-2">
            <ExploreButton compact />
          </div>
        </nav>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="pb-6 pt-10 sm:pt-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <img
          src="/avatar.jpg"
          alt="Aditya Thakare"
          className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-amber-400/70 ring-offset-2 ring-offset-slate-50 sm:ring-offset-4 sm:h-32 sm:w-32 dark:ring-offset-[#030712]"
        />
        <div>
          <h1 className={`text-3xl font-bold tracking-tight sm:text-5xl ${strong}`}>
            Aditya Thakare
          </h1>
          <p className="mt-2 text-base font-medium text-sky-700 sm:text-lg dark:text-sky-400">
            {HEADLINE}
          </p>
          <p className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900 dark:bg-amber-400/10 dark:text-amber-300">
            {AVAILABILITY}
          </p>
        </div>
      </div>

      <p className={`mt-8 max-w-3xl text-base leading-relaxed sm:text-lg ${body}`}>{SUMMARY}</p>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} !p-4`}>
            <dt className={`text-xs ${muted}`}>{s.label}</dt>
            <dd className={`order-first text-2xl font-bold ${strong}`}>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href="/Aditya_Thakare_Resume.pdf" download className={primaryButton}>
          Download resume
        </a>
        <ExploreButton />
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className={secondaryButton}
          >
            {s.label}
          </a>
        ))}
      </div>
      <a href="#match" className={`mt-4 inline-block text-sm ${textLink}`}>
        Hiring? Check a job description against my skills →
      </a>
    </section>
  )
}

export default function ReadablePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />

        <Section id="projects" title="Projects">
          <div className="space-y-6">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {others.length > 0 && (
            <div className={`${card} mt-6`}>
              <h3 className={`text-sm font-semibold ${strong}`}>Also building</h3>
              <ul className="mt-1 divide-y divide-slate-200 dark:divide-white/[0.06]">
                {others.map((p) => (
                  <ProjectRow key={p.id} project={p} />
                ))}
              </ul>
            </div>
          )}
        </Section>

        {experience && (
          <Section id="experience" title="Experience">
            <div className={card}>
              <h3 className={`text-lg font-semibold ${strong}`}>
                Data Scientist · {experience.label}
              </h3>
              <p className={`mt-1 text-sm ${muted}`}>{experience.description}</p>
              {experience.highlights && (
                <ul className={`mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed ${body}`}>
                  {experience.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </Section>
        )}

        <Section
          id="teaching"
          title="Teaching"
          intro={nodeById.get('teaching')?.description}
        >
          <div className={card}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>
              Most taught
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {topTopics.map((t) => (
                <span key={t} className={chip}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {workshopYears.map((year) => {
                const rows = workshops.filter((w) => w.year === year)
                return (
                  <details key={year} className="group text-sm">
                    <summary className={`cursor-pointer font-semibold ${strong} hover:text-sky-700 dark:hover:text-sky-400`}>
                      {year} · {rows.length} workshops
                    </summary>
                    <ul className={`mt-2 space-y-1 pl-4 ${body}`}>
                      {rows.map((w) => (
                        <li key={`${w.dates}-${w.venue}`}>
                          {w.topic}{' '}
                          <span className={muted}>
                            · {w.venue} · {w.dates}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
              })}
            </div>
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <JobMatch />
          <div className={`${card} mt-6 space-y-4`}>
            {skillGroups.map(({ category, skills }) => (
              <div key={category.id} className="sm:flex sm:gap-4">
                <h3 className={`mb-2 text-sm font-semibold sm:mb-0 sm:w-56 sm:shrink-0 ${strong}`}>
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s.id} className={chip}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="certifications" title="Certifications">
          <ul className={`${card} divide-y divide-slate-200 !py-2 dark:divide-white/[0.06]`}>
            {certs.map((c) => (
              <li key={c.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <div>
                  <span className={body}>{c.description}</span>
                  {c.credentialId && (
                    <span className={`block break-all text-xs ${muted}`}>
                      Credential ID {c.credentialId}
                    </span>
                  )}
                </div>
                {c.links?.live && (
                  <a href={c.links.live} target="_blank" rel="noreferrer" className={`shrink-0 ${textLink}`}>
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="writing" title="Writing">
          <ul className="grid gap-3 sm:grid-cols-2">
            {blogs.map((b) => (
              <li key={b.id}>
                <a
                  href={b.links?.live}
                  target="_blank"
                  rel="noreferrer"
                  className={`${card} block !p-4 transition hover:border-sky-500/50`}
                >
                  <span className={`font-semibold ${strong}`}>{b.label}</span>
                  <span className={`mt-1 block text-sm ${muted}`}>{b.description}</span>
                  <span className={`mt-2 block text-xs ${textLink}`}>Read on Medium →</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="education" title="Education">
          <ul className={`${card} space-y-2 text-sm`}>
            {education.map((e) => (
              <li key={e.id} className={body}>
                <span className={`font-semibold ${strong}`}>{e.label}</span> — {e.description}
              </li>
            ))}
          </ul>
        </Section>

        <section id="contact" className="py-14 text-center">
          <h2 className={`text-2xl font-bold sm:text-3xl ${strong}`}>Get in touch</h2>
          <p className={`mx-auto mt-3 max-w-xl text-sm ${body}`}>{AVAILABILITY}.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:adityathakare72@gmail.com" className={primaryButton}>
              adityathakare72@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-thakare72/"
              target="_blank"
              rel="noreferrer"
              className={secondaryButton}
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>
      <footer className={`border-t border-slate-200 py-6 text-center text-xs dark:border-white/[0.06] ${muted}`}>
        Aditya Thakare · Pune, Maharashtra ·{' '}
        <button type="button" onClick={() => useView.getState().setView('graph')} className={`cursor-pointer ${textLink}`}>
          explore this portfolio as a 3D neural network
        </button>
      </footer>
    </div>
  )
}

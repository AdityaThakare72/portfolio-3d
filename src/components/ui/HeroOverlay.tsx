import { motion } from 'framer-motion'
import { AVAILABILITY, HEADLINE } from '../../data/portfolio'
import { useGraphStore } from '../../hooks/useGraphStore'

const socials = [
  { label: 'GitHub', href: 'https://github.com/AdityaThakare72' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-thakare72/' },
  { label: 'Email', href: 'mailto:adityathakare72@gmail.com' },
]

export default function HeroOverlay() {
  const hasInteracted = useGraphStore((s) => s.hasInteracted)
  // Step aside while a node or a legend filter is being explored
  const hidden = useGraphStore((s) => s.selectedNode !== null || s.filter !== null)

  return (
    <motion.div
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
    >
      <div
        className="text-center [text-shadow:0_2px_12px_rgba(3,7,18,0.9)]"
        style={{ pointerEvents: hidden ? 'none' : 'auto' }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl md:text-5xl">
          Aditya Thakare
        </h1>
        <p className="mt-2 text-base tracking-wider text-sky-400 md:text-lg">
          {HEADLINE}
        </p>
        <p className="mt-3 px-4 text-sm tracking-wide text-slate-400">
          3+ years · 4 deployed AI systems · 2,000+ students &amp; faculty trained
        </p>
        <p className="mt-2 px-4 text-sm font-medium tracking-wide text-amber-300">
          {AVAILABILITY}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-300 transition-colors hover:border-sky-400 hover:text-sky-400"
            >
              {s.label}
            </a>
          ))}
        </div>
        {!hasInteracted && (
          <p className="mt-6 animate-pulse text-sm text-slate-500">
            Click any node to explore
          </p>
        )}
      </div>
    </motion.div>
  )
}

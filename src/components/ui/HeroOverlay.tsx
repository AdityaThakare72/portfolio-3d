import { motion } from 'framer-motion'
import { useGraphStore } from '../../hooks/useGraphStore'

const socials = [
  { label: 'GitHub', href: 'https://github.com/AdityaThakare72' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aditya-thakare72/' },
  { label: 'Email', href: 'mailto:adityathakare72@gmail.com' },
]

export default function HeroOverlay() {
  const selectedNode = useGraphStore((s) => s.selectedNode)

  return (
    <motion.div
      animate={{ opacity: selectedNode ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
    >
      <div
        className="text-center [text-shadow:0_2px_12px_rgba(3,7,18,0.9)]"
        style={{ pointerEvents: selectedNode ? 'none' : 'auto' }}
      >
        <h1 className="text-5xl font-bold tracking-tight text-slate-100">
          Aditya Thakare
        </h1>
        <p className="mt-2 text-lg tracking-wider text-sky-400">
          AI Engineer · Data Scientist · MLOps
        </p>
        <div className="mt-6 flex justify-center gap-4">
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
      </div>
    </motion.div>
  )
}

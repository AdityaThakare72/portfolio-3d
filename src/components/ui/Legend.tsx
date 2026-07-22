import { motion } from 'framer-motion'
import { useGraphStore } from '../../hooks/useGraphStore'

export default function Legend() {
  const selectedNode = useGraphStore((s) => s.selectedNode)

  return (
    <motion.div
      animate={{ opacity: selectedNode ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed bottom-6 left-6 z-10 rounded-xl border border-white/[0.08] px-4 py-3 backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(15,23,42,0.8)' }}
    >
      <ul className="space-y-2 text-xs text-slate-300">
        <li className="flex items-center gap-2.5">
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute h-4 w-4 rounded-full border border-sky-400/60" />
            <span className="h-2 w-2 rounded-full bg-sky-400" />
          </span>
          Project
        </li>
        <li className="flex items-center gap-2.5">
          <span className="flex h-4 w-4 items-center justify-center">
            <span className="h-2.5 w-2.5 rotate-45 bg-violet-400" />
          </span>
          Skill Category
        </li>
        <li className="flex items-center gap-2.5">
          <span className="flex h-4 w-4 items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          </span>
          Individual Skill
        </li>
      </ul>
    </motion.div>
  )
}

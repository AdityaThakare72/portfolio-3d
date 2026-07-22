import { AnimatePresence, motion } from 'framer-motion'
import { useProgress } from '@react-three/drei'

// DOM overlay (outside the Canvas) — useProgress tracks drei/three
// loaders globally, so this fades out once all assets resolve
export default function Loader() {
  const { active, progress } = useProgress()

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]"
        >
          <div className="text-center">
            <div className="mb-2 bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-2xl font-extrabold text-transparent">
              AT.
            </div>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

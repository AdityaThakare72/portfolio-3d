import { AVAILABILITY } from '../../data/portfolio'
import { teachingStats } from '../../data/workshops'
import { useGraphStore } from '../../hooks/useGraphStore'
import Modal from './Modal'

export default function AboutOverlay() {
  const showAbout = useGraphStore((s) => s.showAbout)
  const setShowAbout = useGraphStore((s) => s.setShowAbout)

  return (
    <Modal open={showAbout} onClose={() => setShowAbout(false)}>
      <div className="flex items-center gap-4">
        <img
          src="/avatar.jpg"
          alt="Aditya Thakare"
          className="h-20 w-20 rounded-full border border-white/10 object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-white">Aditya Thakare</h2>
          <p className="text-sm text-sky-400">
            Data Scientist | GenAI &amp; Agentic AI | MLOps
          </p>
          <p className="text-sm text-slate-400">Pune, Maharashtra</p>
          <p className="mt-1 text-xs font-medium text-amber-300">{AVAILABILITY}</p>
        </div>
      </div>

      <hr className="my-6 border-white/[0.08]" />

      <p className="text-sm leading-relaxed text-slate-300">
        Data Scientist with 3+ years of experience (since Sep 2023) building
        and deploying Generative AI systems: RAG pipelines, multi-agent
        LangGraph orchestration and end-to-end MLOps workflows. Delivered
        technical training to 2,000+ students and faculty across{' '}
        {teachingStats.workshops} workshops and faculty development programs
        at {teachingStats.institutions} institutions.
      </p>

      <hr className="my-6 border-white/[0.08]" />

      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Experience
      </h3>
      <p className="mt-2 text-sm text-slate-200">
        Data Scientist — MITU Skillologies, Pune{' '}
        <span className="text-slate-400">(Sep 2023 – Present)</span>
      </p>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Education
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-200">
        <li>
          PG Diploma in Artificial Intelligence — CDAC ACTS, Pune{' '}
          <span className="text-slate-400">(2023)</span>
        </li>
        <li>
          B.Tech, Civil Engineering — Savitribai Phule Pune University, CGPA
          7.78 <span className="text-slate-400">(2021)</span>
        </li>
      </ul>
    </Modal>
  )
}

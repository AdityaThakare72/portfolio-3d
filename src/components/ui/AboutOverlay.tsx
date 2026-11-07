import { AVAILABILITY, HEADLINE, TAGLINE, SUMMARY, nodes } from '../../data/portfolio'

const about = nodes.filter((n) => n.type === 'info')
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
            {HEADLINE} · {TAGLINE}
          </p>
          <p className="text-sm text-slate-400">Pune, Maharashtra</p>
          <p className="mt-1 text-xs font-medium text-amber-300">{AVAILABILITY}</p>
        </div>
      </div>

      <hr className="my-6 border-white/[0.08]" />

      <p className="text-sm leading-relaxed text-slate-300">
        {SUMMARY}
      </p>

      <hr className="my-6 border-white/[0.08]" />

      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Experience
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-200">
        {about
          .filter((n) => n.kind === 'experience')
          .map((n) => (
            <li key={n.id}>
              {n.role} — {n.label} <span className="text-slate-400">({n.description})</span>
            </li>
          ))}
      </ul>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Education
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-200">
        {about
          .filter((n) => n.kind === 'education')
          .map((n) => (
            <li key={n.id}>
              {n.label}: {n.description}
            </li>
          ))}
      </ul>
    </Modal>
  )
}

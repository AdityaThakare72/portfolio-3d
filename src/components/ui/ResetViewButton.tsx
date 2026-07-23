import { useGraphStore, deselect } from '../../hooks/useGraphStore'

export default function ResetViewButton() {
  const flyToOverview = useGraphStore((s) => s.flyToOverview)
  const setAutoRotate = useGraphStore((s) => s.setAutoRotate)

  return (
    <button
      type="button"
      aria-label="Reset view"
      title="Reset view"
      onClick={() => {
        deselect()
        setAutoRotate(true)
        flyToOverview()
      }}
      className="fixed bottom-4 right-4 z-10 cursor-pointer rounded-full border border-white/[0.08] p-2.5 text-slate-300 backdrop-blur-xl transition hover:text-white sm:bottom-6 sm:right-6"
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
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 2.64-6.36" />
        <path d="M3 3v6h6" />
      </svg>
    </button>
  )
}

import { useGraphStore, deselect } from '../../hooks/useGraphStore'

export default function Navbar() {
  const flyToCluster = useGraphStore((s) => s.flyToCluster)
  const flyToOverview = useGraphStore((s) => s.flyToOverview)
  const setShowAbout = useGraphStore((s) => s.setShowAbout)
  const setShowContact = useGraphStore((s) => s.setShowContact)

  const openOverlay = (which: 'about' | 'contact') => {
    deselect() // close the detail panel first
    setShowAbout(which === 'about')
    setShowContact(which === 'contact')
  }

  const links = [
    { label: 'Projects', onClick: () => flyToCluster('projects') },
    { label: 'Skills', onClick: () => flyToCluster('skills') },
    { label: 'Blog', onClick: () => flyToCluster('blogs') },
    { label: 'Certs', onClick: () => flyToCluster('certs') },
    { label: 'About', onClick: () => openOverlay('about') },
    { label: 'Contact', onClick: () => openOverlay('contact') },
  ]

  return (
    <nav
      className="fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-white/[0.06] px-6 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}
    >
      <button
        type="button"
        onClick={() => {
          setShowAbout(false)
          setShowContact(false)
          flyToOverview()
        }}
        className="cursor-pointer bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent"
      >
        AT.
      </button>
      <div className="flex items-center gap-4 sm:gap-6">
        {links.map((l) => (
          <button
            key={l.label}
            type="button"
            onClick={l.onClick}
            className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

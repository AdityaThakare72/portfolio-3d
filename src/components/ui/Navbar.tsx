import { useState } from 'react'
import { useGraphStore, deselect } from '../../hooks/useGraphStore'

export default function Navbar() {
  const flyToCluster = useGraphStore((s) => s.flyToCluster)
  const flyToOverview = useGraphStore((s) => s.flyToOverview)
  const setShowAbout = useGraphStore((s) => s.setShowAbout)
  const setShowContact = useGraphStore((s) => s.setShowContact)
  const setShowOverview = useGraphStore((s) => s.setShowOverview)
  const [menuOpen, setMenuOpen] = useState(false)

  const closeOverlays = () => {
    setShowAbout(false)
    setShowContact(false)
    setShowOverview(false)
  }

  const openOverlay = (which: 'about' | 'contact' | 'overview') => {
    deselect() // close the detail panel first
    closeOverlays()
    if (which === 'about') setShowAbout(true)
    if (which === 'contact') setShowContact(true)
    if (which === 'overview') setShowOverview(true)
  }

  const links = [
    { label: 'Overview', onClick: () => openOverlay('overview') },
    { label: 'Projects', onClick: () => flyToCluster('projects') },
    { label: 'Skills', onClick: () => flyToCluster('skills') },
    { label: 'Blog', onClick: () => flyToCluster('blogs') },
    { label: 'Certs', onClick: () => flyToCluster('certs') },
    { label: 'About', onClick: () => openOverlay('about') },
    { label: 'Contact', onClick: () => openOverlay('contact') },
  ]

  const handleLink = (onClick: () => void) => {
    setMenuOpen(false)
    onClick()
  }

  return (
    <nav
      className="fixed inset-x-0 top-0 z-20 flex h-14 items-center justify-between border-b border-white/[0.06] px-4 backdrop-blur-md sm:px-6"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}
    >
      <button
        type="button"
        onClick={() => {
          closeOverlays()
          setMenuOpen(false)
          flyToOverview()
        }}
        className="cursor-pointer bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent"
      >
        AT.
      </button>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Full link row on desktop */}
        <div className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => handleLink(l.onClick)}
              className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Resume: the one-click skim path, always visible */}
        <a
          href="/Aditya_Thakare_Resume.pdf"
          download
          className="rounded-full bg-sky-400 px-3.5 py-1.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-sky-300"
        >
          Resume
        </a>

        {/* Hamburger on mobile */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="cursor-pointer rounded-md p-2 text-slate-300 transition hover:text-white md:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute right-3 top-[60px] flex w-44 flex-col rounded-xl border border-white/[0.08] p-2 backdrop-blur-xl md:hidden"
          style={{ backgroundColor: 'rgba(15,23,42,0.95)' }}
        >
          {links.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => handleLink(l.onClick)}
              className="cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

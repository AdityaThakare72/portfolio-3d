import { create } from 'zustand'

// Two top-level views: the readable page (default) and the 3D graph.
// The graph lives at #explore so it can be linked to and the browser's
// back button returns to the page.
export type View = 'page' | 'graph'

const GRAPH_HASH = '#explore'

const fromHash = (): View =>
  typeof window !== 'undefined' && window.location.hash === GRAPH_HASH
    ? 'graph'
    : 'page'

interface ViewState {
  view: View
  // Open a view; for the page, optionally scroll to a section id
  setView: (view: View, section?: string) => void
}

export const useView = create<ViewState>((set) => ({
  view: fromHash(),
  setView: (view, section) => {
    const hash = view === 'graph' ? GRAPH_HASH : section ? `#${section}` : ''
    if (window.location.hash !== hash) {
      history.pushState(null, '', hash || window.location.pathname)
    }
    set({ view })
    if (view === 'page') {
      requestAnimationFrame(() => {
        if (section) document.getElementById(section)?.scrollIntoView()
        else window.scrollTo(0, 0)
      })
    }
  },
}))

if (typeof window !== 'undefined') {
  // Back/forward and hand-edited hashes
  window.addEventListener('popstate', () => useView.setState({ view: fromHash() }))
}

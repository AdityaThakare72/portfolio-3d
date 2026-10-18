import { lazy, Suspense, useEffect } from 'react'
import ReadablePage from './components/page/ReadablePage'
import { useView } from './hooks/useView'

const GraphView = lazy(() => import('./GraphView'))

function GraphLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#030712]">
      <div className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-2xl font-extrabold text-transparent">
        AT.
      </div>
    </div>
  )
}

export default function App() {
  const view = useView((s) => s.view)

  // The graph is a fixed full-screen canvas; the page scrolls normally
  useEffect(() => {
    document.documentElement.classList.toggle('graph-mode', view === 'graph')
  }, [view])

  return view === 'graph' ? (
    <Suspense fallback={<GraphLoading />}>
      <GraphView />
    </Suspense>
  ) : (
    <ReadablePage />
  )
}

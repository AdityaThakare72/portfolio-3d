import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import NetworkGraph from './components/canvas/NetworkGraph'
import Background from './components/canvas/Background'
import CameraController from './components/canvas/CameraController'
import HeroOverlay from './components/ui/HeroOverlay'
import DetailPanel from './components/ui/DetailPanel'
import Legend from './components/ui/Legend'
import Navbar from './components/ui/Navbar'
import AboutOverlay from './components/ui/AboutOverlay'
import ContactOverlay from './components/ui/ContactOverlay'
import OverviewPanel from './components/ui/OverviewPanel'
import ResetViewButton from './components/ui/ResetViewButton'
import Loader from './components/ui/Loader'
import { useGraphStore, deselect } from './hooks/useGraphStore'

export default function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      // Overlays close first; only then does Escape deselect the node
      const store = useGraphStore.getState()
      if (store.showAbout || store.showContact || store.showOverview) {
        store.setShowAbout(false)
        store.setShowContact(false)
        store.setShowOverview(false)
        return
      }
      deselect()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 100 }}
        onPointerMissed={deselect}
      >
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#a78bfa" />
        {/* Suspense must live inside the Canvas — wrapping the Canvas
            itself remounts the WebGL context when a child suspends */}
        <Suspense fallback={null}>
          <Background />
          <NetworkGraph />
        </Suspense>
        <CameraController />
      </Canvas>
      <Loader />
      <Navbar />
      <HeroOverlay />
      <DetailPanel />
      <Legend />
      <ResetViewButton />
      <AboutOverlay />
      <ContactOverlay />
      <OverviewPanel />
    </div>
  )
}

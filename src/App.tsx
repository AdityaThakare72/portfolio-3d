import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import NetworkGraph from './components/canvas/NetworkGraph'
import Background from './components/canvas/Background'
import CameraController from './components/canvas/CameraController'
import HeroOverlay from './components/ui/HeroOverlay'
import DetailPanel from './components/ui/DetailPanel'
import { deselect } from './hooks/useGraphStore'

export default function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') deselect()
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
        <Background />
        <NetworkGraph />
        <CameraController />
      </Canvas>
      <HeroOverlay />
      <DetailPanel />
    </div>
  )
}

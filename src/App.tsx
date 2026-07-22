import { Canvas } from '@react-three/fiber'
import NetworkGraph from './components/canvas/NetworkGraph'
import Background from './components/canvas/Background'
import CameraController from './components/canvas/CameraController'
import HeroOverlay from './components/ui/HeroOverlay'

export default function App() {
  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 100 }}>
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#a78bfa" />
        <Background />
        <NetworkGraph />
        <CameraController />
      </Canvas>
      <HeroOverlay />
    </div>
  )
}

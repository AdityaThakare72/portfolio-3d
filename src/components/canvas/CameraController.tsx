import { OrbitControls } from '@react-three/drei'

export default function CameraController() {
  // TODO (Phase 2): fly-to animation toward useGraphStore's cameraTarget
  return (
    <OrbitControls
      autoRotate
      autoRotateSpeed={0.4}
      enableDamping
      dampingFactor={0.05}
      minDistance={8}
      maxDistance={30}
      enablePan={false}
    />
  )
}

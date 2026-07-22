import { OrbitControls } from '@react-three/drei'

export default function CameraController() {
  // TODO: fly-to animation toward useGraphStore's cameraTarget
  return (
    <OrbitControls
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.5}
      minDistance={5}
      maxDistance={40}
    />
  )
}

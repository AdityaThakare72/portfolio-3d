import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useGraphStore } from '../../hooks/useGraphStore'

// Camera settles offset from the selected node, looking at it from
// slightly above and to the side
const FLY_OFFSET = new Vector3(2, 1.5, 3)
const ORIGIN = new Vector3(0, 0, 0)
const LERP = 0.04

const dest = new Vector3()
const look = new Vector3()

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const returning = useRef(false)
  const prevSelected = useRef<string | null>(null)

  useFrame(({ camera }) => {
    const controls = controlsRef.current
    if (!controls) return
    const store = useGraphStore.getState()
    const { selectedNode, cameraTarget } = store

    // Selection transitions: save overview position on zoom-in from
    // overview, start the return flight on deselect
    if (selectedNode !== prevSelected.current) {
      if (selectedNode && !prevSelected.current) {
        store.setOverviewPosition([
          camera.position.x,
          camera.position.y,
          camera.position.z,
        ])
        returning.current = false
      }
      if (!selectedNode) returning.current = true
      prevSelected.current = selectedNode
    }

    if (cameraTarget) {
      look.set(...cameraTarget)
      dest.copy(look).add(FLY_OFFSET)
      camera.position.lerp(dest, LERP)
      controls.target.lerp(look, LERP)
      controls.autoRotate = false
      controls.minDistance = 3 // allow the close-up; overview clamp is 8
    } else if (returning.current) {
      dest.set(...store.overviewPosition)
      camera.position.lerp(dest, LERP)
      controls.target.lerp(ORIGIN, LERP)
      controls.autoRotate = false
      if (camera.position.distanceTo(dest) < 0.2) {
        returning.current = false
        controls.minDistance = 8
      }
    } else {
      controls.autoRotate = true
    }
    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      autoRotateSpeed={0.4}
      minDistance={8}
      maxDistance={30}
      enablePan={false}
    />
  )
}

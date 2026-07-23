import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useGraphStore } from '../../hooks/useGraphStore'

const ORIGIN = new Vector3(0, 0, 0)
const LERP = 0.04

const dest = new Vector3()
const look = new Vector3()
const offset = new Vector3()

export default function CameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const returning = useRef(false)
  const prevSelected = useRef<string | null>(null)

  useFrame(({ camera }) => {
    const controls = controlsRef.current
    if (!controls) return
    const store = useGraphStore.getState()
    const { selectedNode, cameraTarget, cameraOffset } = store

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
      returning.current = false
      look.set(...cameraTarget)
      offset.set(...cameraOffset)
      dest.copy(look).add(offset)
      camera.position.lerp(dest, LERP)
      controls.target.lerp(look, LERP)
      controls.autoRotate = false
      controls.minDistance = 3 // allow the close-up; overview clamp is 8
      // Cluster/overview flights (no selected node) end on arrival so
      // orbiting and auto-rotate come back
      if (!selectedNode && camera.position.distanceTo(dest) < 0.2) {
        store.setCameraTarget(null)
        controls.minDistance = 8
      }
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
      controls.autoRotate = store.autoRotate
    }
    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      // Any grab/scroll pauses auto-rotation until "Reset view"
      onStart={() => useGraphStore.getState().setAutoRotate(false)}
      enableDamping
      dampingFactor={0.05}
      autoRotateSpeed={0.4}
      minDistance={8}
      maxDistance={22}
      enablePan={false}
    />
  )
}

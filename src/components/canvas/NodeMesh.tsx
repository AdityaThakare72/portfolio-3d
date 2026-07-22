import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import type { Mesh, MeshStandardMaterial } from 'three'
import { neighbors, type Node } from '../../data/portfolio'
import { useGraphStore } from '../../hooks/useGraphStore'

const BASE_EMISSIVE = { project: 0.6, category: 0.3, skill: 0.3 } as const
const HOVER_EMISSIVE = { project: 1.2, category: 0.8, skill: 0.6 } as const
const LERP = 0.15

export default function NodeMesh({ node, index }: { node: Node; index: number }) {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const isProject = node.type === 'project'

  const hoveredNode = useGraphStore((s) => s.hoveredNode)
  const isHovered = hoveredNode === node.id
  const isNeighborOfHovered =
    hoveredNode !== null && (neighbors.get(hoveredNode)?.has(node.id) ?? false)
  const dimmed = hoveredNode !== null && !isHovered && !isNeighborOfHovered
  const baseOpacity = node.type === 'skill' ? 0.7 : 0.9

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    const material = materialRef.current
    if (!mesh || !material) return
    const pulse = isProject
      ? 1 + Math.sin(clock.elapsedTime * 1.5 + index) * 0.04
      : 1
    const targetScale = pulse * (isHovered ? 1.2 : 1)
    mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * LERP)
    const targetEmissive = isHovered
      ? HOVER_EMISSIVE[node.type]
      : BASE_EMISSIVE[node.type]
    material.emissiveIntensity +=
      (targetEmissive - material.emissiveIntensity) * LERP
    const targetOpacity = dimmed ? 0.3 : baseOpacity
    material.opacity += (targetOpacity - material.opacity) * LERP
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const store = useGraphStore.getState()
    if (store.selectedNode === node.id) {
      store.setSelectedNode(null)
      store.setCameraTarget(null)
    } else {
      store.setSelectedNode(node.id)
      store.setCameraTarget(node.position)
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    useGraphStore.getState().setHoveredNode(node.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    useGraphStore.getState().setHoveredNode(null)
    document.body.style.cursor = 'default'
  }

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {node.type === 'category' ? (
          <octahedronGeometry args={[node.size * 0.3, 0]} />
        ) : (
          <sphereGeometry args={[node.size * 0.3, 32, 32]} />
        )}
        <meshStandardMaterial
          ref={materialRef}
          color={node.color}
          emissive={node.color}
          emissiveIntensity={BASE_EMISSIVE[node.type]}
          transparent
          opacity={baseOpacity}
        />
      </mesh>
      {isProject && (
        <>
          <mesh>
            <sphereGeometry args={[node.size * 0.4, 16, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[node.size * 0.45, 0.03, 8, 32]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.3} />
          </mesh>
        </>
      )}
      {(node.type !== 'skill' || isHovered) && (
        <Billboard position={[0, node.size * (isProject ? 0.8 : 0.65), 0]}>
          <Text
            fontSize={isProject ? 0.34 : node.type === 'category' ? 0.22 : 0.18}
            color="#cbd5e1"
            anchorX="center"
            anchorY="bottom"
          >
            {node.label}
          </Text>
        </Billboard>
      )}
    </group>
  )
}

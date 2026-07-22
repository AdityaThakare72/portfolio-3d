import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import type { Mesh } from 'three'
import type { Node } from '../../data/portfolio'

export default function NodeMesh({ node, index }: { node: Node; index: number }) {
  const meshRef = useRef<Mesh>(null)
  const isProject = node.type === 'project'

  useFrame(({ clock }) => {
    if (!isProject || !meshRef.current) return
    const scale = 1 + Math.sin(clock.elapsedTime * 1.5 + index) * 0.04
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <group position={node.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[node.size * 0.3, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isProject ? 0.6 : 0.3}
          transparent
          opacity={node.type === 'skill' ? 0.7 : 0.9}
        />
      </mesh>
      {isProject && (
        <mesh>
          <sphereGeometry args={[node.size * 0.6, 16, 16]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      )}
      {node.type !== 'skill' && (
        <Billboard position={[0, node.size * 0.5, 0]}>
          <Text
            fontSize={isProject ? 0.34 : 0.26}
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

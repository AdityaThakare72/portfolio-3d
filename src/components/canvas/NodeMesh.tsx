import type { Node } from '../../data/portfolio'

export default function NodeMesh({ node }: { node: Node }) {
  return (
    <mesh position={node.position}>
      <sphereGeometry args={[node.size, 32, 32]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

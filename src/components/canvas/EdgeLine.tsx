import { Line } from '@react-three/drei'
import { nodes, type Edge } from '../../data/portfolio'

export default function EdgeLine({ edge }: { edge: Edge }) {
  const source = nodes.find((n) => n.id === edge.source)
  const target = nodes.find((n) => n.id === edge.target)
  if (!source || !target) return null

  return (
    <Line
      points={[source.position, target.position]}
      color="#94a3b8"
      transparent
      opacity={0.1}
    />
  )
}

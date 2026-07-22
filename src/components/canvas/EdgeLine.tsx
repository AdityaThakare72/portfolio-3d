import { Line } from '@react-three/drei'
import { nodeById, type Edge } from '../../data/portfolio'

export default function EdgeLine({ edge }: { edge: Edge }) {
  const source = nodeById.get(edge.source)
  const target = nodeById.get(edge.target)
  if (!source || !target) return null

  return (
    <Line
      points={[source.position, target.position]}
      color="#94a3b8"
      lineWidth={0.5}
      transparent
      opacity={0.12}
    />
  )
}

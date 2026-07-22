import { Line } from '@react-three/drei'
import { nodeById, type Edge } from '../../data/portfolio'
import { useGraphStore } from '../../hooks/useGraphStore'

export default function EdgeLine({ edge }: { edge: Edge }) {
  const hoveredNode = useGraphStore((s) => s.hoveredNode)
  const source = nodeById.get(edge.source)
  const target = nodeById.get(edge.target)
  if (!source || !target) return null

  const highlighted =
    hoveredNode === edge.source || hoveredNode === edge.target
  const hoveredColor = highlighted
    ? nodeById.get(hoveredNode!)?.color ?? '#94a3b8'
    : '#94a3b8'

  return (
    <Line
      points={[source.position, target.position]}
      color={hoveredColor}
      lineWidth={highlighted ? 1.0 : 0.5}
      transparent
      opacity={highlighted ? 0.4 : 0.12}
    />
  )
}

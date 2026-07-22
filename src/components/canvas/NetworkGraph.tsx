import { nodes, edges } from '../../data/portfolio'
import NodeMesh from './NodeMesh'
import EdgeLine from './EdgeLine'

export default function NetworkGraph() {
  return (
    <group>
      {edges.map((edge) => (
        <EdgeLine key={`${edge.source}-${edge.target}`} edge={edge} />
      ))}
      {nodes.map((node, index) => (
        <NodeMesh key={node.id} node={node} index={index} />
      ))}
    </group>
  )
}

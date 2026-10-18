import { edges, nodeById, nodes, type Node } from '../data/portfolio'
import { selectNode, useGraphStore } from './useGraphStore'

// The ordered group a node is browsed within: skills step through their
// own category, everything else through nodes of the same type
export function siblings(node: Node): Node[] {
  if (node.type === 'skill') {
    const categoryId = edges.find(
      (e) => e.target === node.id && nodeById.get(e.source)?.type === 'category',
    )?.source
    return edges
      .filter((e) => e.source === categoryId)
      .map((e) => nodeById.get(e.target))
      .filter((n): n is Node => n?.type === 'skill')
  }
  return nodes.filter((n) => n.type === node.type)
}

// Move the open panel to the previous (-1) or next (+1) sibling, wrapping
export function stepSelection(dir: -1 | 1) {
  const id = useGraphStore.getState().selectedNode
  const node = id ? nodeById.get(id) : undefined
  if (!node) return
  const list = siblings(node)
  const i = list.findIndex((n) => n.id === node.id)
  if (i < 0 || list.length < 2) return
  selectNode(list[(i + dir + list.length) % list.length].id)
}

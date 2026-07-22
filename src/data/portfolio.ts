export type NodeType = 'project' | 'category' | 'skill'

export interface Node {
  id: string
  type: NodeType
  label: string
  description?: string
  color: string
  size: number
  position: [number, number, number]
  links?: { live?: string; source?: string }
  tags?: string[]
}

export interface Edge {
  source: string
  target: string
}

export const COLORS = {
  background: '#030712',
  project: '#38bdf8',
  category: '#a78bfa',
  skill: '#94a3b8',
  edge: 'rgba(148,163,184,0.1)',
  text: '#f1f5f9',
  accent: '#38bdf8',
} as const

// TODO: populate with Aditya's projects, skill categories, and skills
// (spherical layout, pre-computed positions — see CLAUDE.md "Content Source")
export const nodes: Node[] = []

export const edges: Edge[] = []

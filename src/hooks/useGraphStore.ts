import { create } from 'zustand'
import { nodeById, nodes, type NodeType } from '../data/portfolio'

type Vec3 = [number, number, number]

// Legend filter: one node type, or one skill category (with its skills
// and the projects connected to it)
export type Filter =
  | { kind: 'type'; types: NodeType[] }
  | { kind: 'category'; id: string }

export type Cluster = 'projects' | 'skills' | 'blogs' | 'certs' | 'info'

// Camera position = cameraTarget + cameraOffset; the camera looks at
// cameraTarget. Node selection uses a close-up offset, cluster/overview
// flights pass a wider one.
export const NODE_OFFSET: Vec3 = [2, 1.5, 3]

interface GraphState {
  selectedNode: string | null
  hoveredNode: string | null
  cameraTarget: Vec3 | null
  cameraOffset: Vec3
  // Camera position saved when zooming in, restored on back-to-overview
  overviewPosition: Vec3
  showAbout: boolean
  showContact: boolean
  // First node selection ever — used to retire the onboarding hint
  hasInteracted: boolean
  autoRotate: boolean
  // Locked legend filter (click) and temporary preview (legend hover)
  filter: Filter | null
  previewFilter: Filter | null
  setSelectedNode: (id: string | null) => void
  setHoveredNode: (id: string | null) => void
  setCameraTarget: (pos: Vec3 | null, offset?: Vec3) => void
  setOverviewPosition: (pos: Vec3) => void
  setShowAbout: (show: boolean) => void
  setShowContact: (show: boolean) => void
  setAutoRotate: (v: boolean) => void
  setFilter: (f: Filter | null) => void
  setPreviewFilter: (f: Filter | null) => void
  flyToCluster: (type: Cluster) => void
  flyToOverview: () => void
}

function centroid(positions: Vec3[]): Vec3 {
  const sum = positions.reduce(
    (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]] as Vec3,
    [0, 0, 0] as Vec3,
  )
  const n = positions.length || 1
  return [sum[0] / n, sum[1] / n, sum[2] / n]
}

export const useGraphStore = create<GraphState>((set, get) => ({
  selectedNode: null,
  hoveredNode: null,
  cameraTarget: null,
  cameraOffset: NODE_OFFSET,
  overviewPosition: [0, 0, 18],
  showAbout: false,
  showContact: false,
  hasInteracted: false,
  autoRotate: true,
  filter: null,
  previewFilter: null,
  setSelectedNode: (id) =>
    set(
      // Selecting a node counts as the first interaction and pauses
      // auto-rotation until "Reset view"
      id
        ? { selectedNode: id, hasInteracted: true, autoRotate: false }
        : { selectedNode: id },
    ),
  setHoveredNode: (id) => set({ hoveredNode: id }),
  setCameraTarget: (pos, offset = NODE_OFFSET) =>
    set({ cameraTarget: pos, cameraOffset: offset }),
  setOverviewPosition: (pos) => set({ overviewPosition: pos }),
  setShowAbout: (show) => set({ showAbout: show }),
  setShowContact: (show) => set({ showContact: show }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setFilter: (f) => set({ filter: f }),
  setPreviewFilter: (f) => set({ previewFilter: f }),
  flyToCluster: (type) => {
    const clusters: Record<string, { types: string[]; offset: Vec3 }> = {
      projects: { types: ['project'], offset: [0, 3, 14] },
      skills: { types: ['category', 'skill'], offset: [0, 3, 12] },
      blogs: { types: ['blog'], offset: [0, 3, 16] },
      certs: { types: ['cert'], offset: [0, 3, 16] },
      info: { types: ['info'], offset: [0, 3, 16] },
    }
    const { types, offset } = clusters[type]
    const center = centroid(
      nodes.filter((n) => types.includes(n.type)).map((n) => n.position),
    )
    set({ selectedNode: null })
    get().setCameraTarget(center, offset)
  },
  flyToOverview: () => {
    const { overviewPosition } = get()
    set({ selectedNode: null })
    // look at the origin with the camera landing on overviewPosition
    get().setCameraTarget([0, 0, 0], overviewPosition)
  },
}))

// Open a node's panel and fly the camera to it
export function selectNode(id: string) {
  const node = nodeById.get(id)
  if (!node) return
  const store = useGraphStore.getState()
  store.setSelectedNode(id)
  store.setCameraTarget(node.position)
}

export function deselect() {
  const store = useGraphStore.getState()
  store.setSelectedNode(null)
  store.setCameraTarget(null)
}

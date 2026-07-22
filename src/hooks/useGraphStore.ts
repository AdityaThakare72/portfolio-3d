import { create } from 'zustand'

interface GraphState {
  selectedNode: string | null
  hoveredNode: string | null
  cameraTarget: [number, number, number] | null
  // Camera position saved when zooming in, restored on back-to-overview
  overviewPosition: [number, number, number]
  setSelectedNode: (id: string | null) => void
  setHoveredNode: (id: string | null) => void
  setCameraTarget: (pos: [number, number, number] | null) => void
  setOverviewPosition: (pos: [number, number, number]) => void
}

export const useGraphStore = create<GraphState>((set) => ({
  selectedNode: null,
  hoveredNode: null,
  cameraTarget: null,
  overviewPosition: [0, 0, 18],
  setSelectedNode: (id) => set({ selectedNode: id }),
  setHoveredNode: (id) => set({ hoveredNode: id }),
  setCameraTarget: (pos) => set({ cameraTarget: pos }),
  setOverviewPosition: (pos) => set({ overviewPosition: pos }),
}))

export function deselect() {
  const store = useGraphStore.getState()
  store.setSelectedNode(null)
  store.setCameraTarget(null)
}

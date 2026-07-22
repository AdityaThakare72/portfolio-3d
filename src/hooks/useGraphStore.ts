import { create } from 'zustand'

interface GraphState {
  selectedNode: string | null
  hoveredNode: string | null
  cameraTarget: [number, number, number] | null
  selectNode: (id: string | null) => void
  hoverNode: (id: string | null) => void
  setCameraTarget: (target: [number, number, number] | null) => void
}

export const useGraphStore = create<GraphState>((set) => ({
  selectedNode: null,
  hoveredNode: null,
  cameraTarget: null,
  selectNode: (id) => set({ selectedNode: id }),
  hoverNode: (id) => set({ hoveredNode: id }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}))

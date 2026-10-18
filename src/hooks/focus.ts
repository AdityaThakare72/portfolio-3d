import { edges, nodes } from '../data/portfolio'
import { useGraphStore, type Filter } from './useGraphStore'

// Node ids a legend filter keeps bright. Cached per filter so every
// node and edge can look itself up cheaply each render.
const cache = new Map<string, Set<string>>()

function filterKey(f: Filter) {
  return f.kind === 'type' ? `type:${f.types.join(',')}` : `cat:${f.id}`
}

export function focusSet(f: Filter): Set<string> {
  const key = filterKey(f)
  const hit = cache.get(key)
  if (hit) return hit
  let ids: Set<string>
  if (f.kind === 'type') {
    ids = new Set(nodes.filter((n) => f.types.includes(n.type)).map((n) => n.id))
  } else {
    // The category, its skills, and every project linked to either
    ids = new Set([f.id])
    for (const e of edges) if (e.source === f.id) ids.add(e.target)
    for (const e of edges) {
      if (ids.has(e.target) && nodes.find((n) => n.id === e.source)?.type === 'project') {
        ids.add(e.source)
      }
    }
  }
  cache.set(key, ids)
  return ids
}

export function sameFilter(a: Filter | null, b: Filter | null) {
  return !!a && !!b && filterKey(a) === filterKey(b)
}

// The filter currently shaping the scene: legend hover wins over a lock
export function useActiveFocus(): Set<string> | null {
  const filter = useGraphStore((s) => s.previewFilter ?? s.filter)
  return filter ? focusSet(filter) : null
}

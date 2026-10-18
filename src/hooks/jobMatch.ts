import { edges, nodeById, nodes, type Node } from '../data/portfolio'
import { categoryAliases, skillAliases } from '../data/skillAliases'

// Plain keyword matching of a pasted job description against the skills on
// this site. Runs entirely in the browser; nothing is sent anywhere.

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

// Whole-word match, so "SQL" doesn't fire inside "NoSQL"
const wordRegex = (term: string) =>
  new RegExp(`(^|[^a-z0-9+#])${escape(term.toLowerCase())}($|[^a-z0-9+#])`, 'i')

const matchers = (n: Node, aliases: Record<string, string[]>) =>
  [n.label, ...(aliases[n.id] ?? [])].map(wordRegex)

const skills = nodes.filter((n) => n.type === 'skill')
const categories = nodes.filter((n) => n.type === 'category')
const skillMatchers = skills.map((s) => ({ node: s, res: matchers(s, skillAliases) }))
const categoryMatchers = categories.map((c) => ({ node: c, res: matchers(c, categoryAliases) }))

export interface JobMatch {
  skills: Node[]
  categories: Node[]
  // Projects using at least one matched skill, most matches first
  evidence: { project: Node; skills: Node[] }[]
}

export function matchJob(text: string): JobMatch {
  const t = text.toLowerCase()
  const matched = skillMatchers.filter((m) => m.res.some((r) => r.test(t))).map((m) => m.node)
  const matchedCats = categoryMatchers.filter((m) => m.res.some((r) => r.test(t))).map((m) => m.node)
  const ids = new Set(matched.map((s) => s.id))
  const byProject = new Map<string, Node[]>()
  for (const e of edges) {
    const src = nodeById.get(e.source)
    if (src?.type === 'project' && ids.has(e.target)) {
      byProject.set(src.id, [...(byProject.get(src.id) ?? []), nodeById.get(e.target)!])
    }
  }
  const evidence = [...byProject.entries()]
    .map(([id, s]) => ({ project: nodeById.get(id)!, skills: s }))
    .sort((a, b) => b.skills.length - a.skills.length)
  return { skills: matched, categories: matchedCats, evidence }
}

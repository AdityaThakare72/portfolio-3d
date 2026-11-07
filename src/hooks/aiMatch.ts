import { isWork, nodeById, type Node } from '../data/portfolio'
import { profile, profileIds } from '../data/profile'

export type Status = 'match' | 'partial' | 'gap'

export interface AiRequirement {
  requirement: string
  status: Status
  evidence: string
  refs: Node[]
}

export interface AiMatch {
  summary: string
  requirements: AiRequirement[]
  topProjects: { project: Node; reason: string }[]
}

interface RawMatch {
  summary: string
  requirements: { requirement: string; status: Status; evidence: string; refs: string[] }[]
  topProjects: { id: string; reason: string }[]
}

// Whether the serverless function has a Gemini key configured
export async function aiMatchEnabled(): Promise<boolean> {
  try {
    const res = await fetch('/api/match')
    return res.ok && (await res.json()).enabled === true
  } catch {
    return false
  }
}

// Ask the serverless function for an AI analysis, then keep only what the
// site's own data can back up: unknown ids are dropped, and a "match" or
// "partial" without any real evidence is shown as a gap.
export async function fetchAiMatch(jd: string): Promise<AiMatch> {
  const res = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jd, profile }),
  })
  const data = (await res.json().catch(() => ({}))) as Partial<RawMatch> & { error?: string }
  if (!res.ok) throw new Error(data.error || 'The AI service is unavailable right now.')

  const known = (ids: string[]) =>
    ids.filter((id) => profileIds.has(id)).map((id) => nodeById.get(id)).filter((n): n is Node => !!n)

  const requirements = (data.requirements ?? []).map((r) => {
    const refs = known(r.refs ?? [])
    const status: Status = r.status !== 'gap' && refs.length === 0 ? 'gap' : r.status
    return {
      requirement: r.requirement,
      status,
      evidence: status === r.status ? r.evidence : 'Not shown on the profile.',
      refs,
    }
  })
  const topProjects = (data.topProjects ?? [])
    .map((p) => ({ project: nodeById.get(p.id), reason: p.reason }))
    .filter((p): p is { project: Node; reason: string } => isWork(p.project))

  if (!data.summary || requirements.length === 0) {
    throw new Error('The AI returned an empty answer. Please try again.')
  }
  return { summary: data.summary, requirements, topProjects }
}

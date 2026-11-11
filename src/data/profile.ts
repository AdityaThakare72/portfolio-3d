import { AVAILABILITY, HEADLINE, SUMMARY, TAGLINE, edges, nodeById, nodes, type Node } from './portfolio'
import { teachingStats } from './workshops'

// A compact, factual profile built from the site's own data. It is what the
// AI job matcher is allowed to use as evidence, so editing portfolio.ts
// updates the matcher automatically. Every item carries an id the model must
// cite; the page only shows ids that exist here.

const of = (type: Node['type']) => nodes.filter((n) => n.type === type)

const skillsOf = (categoryId: string) =>
  edges
    .filter((e) => e.source === categoryId)
    .map((e) => nodeById.get(e.target))
    .filter((n): n is Node => n?.type === 'skill')

export const profile = {
  headline: `${HEADLINE} (${TAGLINE})`,
  summary: SUMMARY,
  availability: AVAILABILITY,
  skills: of('category').map((c) => ({
    category: c.label,
    items: skillsOf(c.id).map((s) => ({ id: s.id, name: s.label })),
  })),
  projects: of('project').map((p) => ({
    id: p.id,
    name: p.label,
    status: p.status === 'in-progress' ? 'in progress' : p.links ? 'deployed' : 'client project in production',
    description: p.description,
    ...(p.story && { decision: p.story.decision, outcome: p.story.outcome }),
    tech: p.tags ?? [],
  })),
  experience: of('info')
    .filter((n) => n.kind === 'experience' || n.kind === 'teaching')
    .map((n) => ({
      id: n.id,
      title: n.role ? `${n.role}, ${n.label}` : n.label,
      details: [
        n.description,
        ...(n.inProduction ? ['Client system running in production'] : []),
        ...(n.highlights ?? []),
        ...(n.tags?.length ? [`Tech: ${n.tags.join(', ')}`] : []),
      ],
    })),
  openSource: of('info')
    .filter((n) => n.kind === 'oss')
    .map((n) => ({
      id: n.id,
      name: `${n.label} (${n.role})`,
      // Tell the matcher when a PR is not merged yet
      details: n.prStatus === 'open' ? `${n.description} Status: open, awaiting review.` : n.description,
    })),
  teaching: `${teachingStats.workshops} workshops at ${teachingStats.institutions} institutions, ${teachingStats.from}–${teachingStats.to}`,
  certifications: of('cert').map((c) => ({ id: c.id, name: c.description })),
  education: of('info')
    .filter((n) => n.kind === 'education')
    .map((n) => ({ id: n.id, name: `${n.label}: ${n.description}` })),
}

// Every id the model may cite, for validating its answer
export const profileIds = new Set<string>([
  ...profile.skills.flatMap((c) => c.items.map((s) => s.id)),
  ...profile.projects.map((p) => p.id),
  ...profile.experience.map((e) => e.id),
  ...profile.openSource.map((o) => o.id),
  ...profile.certifications.map((c) => c.id),
  ...profile.education.map((e) => e.id),
])

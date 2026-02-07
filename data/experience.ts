import experienceData from './content/experience.json'

export interface ExperienceEntry {
  company: string
  role: string
  start: string
  end: string | null
  location: string
  roleDescription: string
  highlights: string[]
  techStack: string[]
  impact?: string[]
  link?: { url: string; label?: string }
}

export const experienceEntries: ExperienceEntry[] = experienceData as ExperienceEntry[]

export function formatPeriod(start: string, end: string | null): string {
  const s = new Date(start + '-01')
  const startStr = s.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  if (!end) return `${startStr} - Present`
  const e = new Date(end + '-01')
  const endStr = e.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${startStr} - ${endStr}`
}

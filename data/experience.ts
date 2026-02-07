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

function getTotalMonths(entries: ExperienceEntry[]): number {
  if (entries.length === 0) return 0
  const now = new Date()
  const starts = entries.map((e) => new Date(e.start + '-01'))
  const ends = entries.map((e) => (e.end ? new Date(e.end + '-01') : now))
  const minStart = new Date(Math.min(...starts.map((d) => d.getTime())))
  const maxEnd = new Date(Math.max(...ends.map((d) => d.getTime())))
  return (maxEnd.getFullYear() - minStart.getFullYear()) * 12 + (maxEnd.getMonth() - minStart.getMonth())
}

export function getYearsOfExperience(entries: ExperienceEntry[]): number {
  return Math.floor(getTotalMonths(entries) / 12)
}

export function getYearsOfExperienceDisplay(entries: ExperienceEntry[]): string {
  const months = getTotalMonths(entries)
  if (months === 0) return '0 years'
  const fullYears = Math.floor(months / 12)
  const remainder = months % 12
  if (remainder >= 5) return `${fullYears}.5+ years`
  return `${fullYears}+ years`
}

export function formatPeriod(start: string, end: string | null): string {
  const s = new Date(start + '-01')
  const startStr = s.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  if (!end) return `${startStr} - Present`
  const e = new Date(end + '-01')
  const endStr = e.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  return `${startStr} - ${endStr}`
}

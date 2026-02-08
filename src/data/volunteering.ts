import volunteeringData from './content/volunteering.json'

export interface VolunteeringEntry {
  organization: string
  role: string
  start: string
  end: string | null
  location: string
  description: string
  highlights: string[]
  tags: string[]
  link?: { url: string; label?: string }
}

export const volunteeringEntries: VolunteeringEntry[] = volunteeringData as VolunteeringEntry[]

export function formatVolunteeringPeriod(start: string, end: string | null): string {
  const s = new Date(start + '-01')
  const startStr = s.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  if (!end) return `${startStr} - Present`
  const e = new Date(end + '-01')
  const endStr = e.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${startStr} - ${endStr}`
}

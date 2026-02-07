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

export function getVolunteeringDurationMonths(start: string, end: string | null): number {
  const s = new Date(start + '-01')
  const e = end ? new Date(end + '-01') : new Date()
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1
}

export function formatVolunteeringDuration(start: string, end: string | null): string {
  const months = getVolunteeringDurationMonths(start, end)
  if (months <= 0) return ''
  if (months === 1) return '1 mo'
  if (months < 12) return `${months} mos`
  const years = Math.floor(months / 12)
  const remainder = months % 12
  if (remainder === 0) return `${years} ${years === 1 ? 'yr' : 'yrs'}`
  return `${years} yr ${remainder} mos`
}

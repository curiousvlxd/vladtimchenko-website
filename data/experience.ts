import experienceData from './content/experience.json'

const MONTHS_IN_YEAR = 12
const ROUNDING_STEP = 0.5

export const EXPERIENCE_DOMAINS = [
  'Fintech',
  'Oil & gas',
  'Robotics',
  'DAM (Digital Asset Management)',
] as const

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

export const experienceEntries: ExperienceEntry[] =
  experienceData as ExperienceEntry[]

function getMonthIndex(date: Date): number {
  return date.getFullYear() * MONTHS_IN_YEAR + date.getMonth()
}

function parseMonth(value: string): Date {
  return new Date(`${value}-01`)
}

export function formatPeriod(start: string, end: string | null): string {
  const s = parseMonth(start)
  const startStr = s.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })

  if (!end) return `${startStr} - Present`

  const e = parseMonth(end)
  const endStr = e.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })

  return `${startStr} - ${endStr}`
}

export function getTotalExperienceYears(
  entries: ExperienceEntry[] = experienceEntries
): number {
  if (!entries.length) return 0

  const months = new Set<number>()

  for (const entry of entries) {
    const start = parseMonth(entry.start)
    const end = entry.end ? parseMonth(entry.end) : new Date()

    let current = getMonthIndex(start)
    const last = getMonthIndex(end)

    while (current <= last) {
      months.add(current)
      current++
    }
  }

  const totalMonths = months.size
  const years = totalMonths / MONTHS_IN_YEAR

  return Math.round(years / ROUNDING_STEP) * ROUNDING_STEP
}

export function getTotalExperienceDisplay(
  entries: ExperienceEntry[] = experienceEntries
): string {
  const y = getTotalExperienceYears(entries)
  const rounded = Math.ceil(y)

  return `~${rounded} years`
}

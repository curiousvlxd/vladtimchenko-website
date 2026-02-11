const DEFAULT_LOCALE = 'en-US'

export function formatBlogDate(
  date: string | undefined,
  options: { month?: 'short' | 'long' } = {}
): string {
  if (!date) return ''
  const { month = 'short' } = options
  return new Date(date).toLocaleDateString(DEFAULT_LOCALE, {
    day: 'numeric',
    month,
    year: 'numeric'
  })
}

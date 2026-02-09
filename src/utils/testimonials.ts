export function getParagraphs(text: string): string[] {
  return text.split('\n\n').filter(p => p.trim())
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function needsReadMore(element: HTMLElement | null): boolean {
  if (!element) return false
  return element.scrollHeight > 120
}

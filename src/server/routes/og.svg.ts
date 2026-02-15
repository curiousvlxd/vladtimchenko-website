import { CACHE } from '~/common/constants/runtime/cache'
import { SITE_NAME } from '~/common/constants/app/site'

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const BG_COLOR = '#05090E'
const ACCENT_COLOR = '#18B7A4'
const SITE_LABEL = 'vladtimchenko.dev'

function getQueryValue(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return null
}

function normalizeQueryValue(value: unknown, maxLength: number): string | null {
  const queryValue = getQueryValue(value)
  const normalized = queryValue?.replace(/\s+/g, ' ').trim()
  if (!normalized) return null
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

function withEllipsis(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

function formatDisplayUrl(value: string): string {
  const normalized = value.trim()
  if (!normalized) return SITE_LABEL

  try {
    const parsed = new URL(normalized)
    const pathname = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '')
    return `${parsed.host}${pathname}${parsed.search}`
  } catch {
    if (normalized.startsWith('/')) return `${SITE_LABEL}${normalized}`
    return normalized.replace(/^https?:\/\//i, '')
  }
}

function escapeSvgText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function splitIntoLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    if (candidate.length <= maxChars) {
      currentLine = candidate
      continue
    }

    if (currentLine) {
      lines.push(currentLine)
      if (lines.length === maxLines) return lines
    }

    currentLine = word.length <= maxChars ? word : word.slice(0, maxChars)
  }

  if (currentLine && lines.length < maxLines) lines.push(currentLine)
  return lines.length > 0 ? lines : ['']
}

function renderTextLines(
  lines: string[],
  options: {
    x: number
    y: number
    fontSize: number
    lineHeight: number
    fontWeight: number
    fill: string
    letterSpacing?: number
  }
): string {
  const { x, y, fontSize, lineHeight, fontWeight, fill, letterSpacing } = options
  const letterSpacingAttr = typeof letterSpacing === 'number' ? ` letter-spacing="${letterSpacing}"` : ''
  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeSvgText(line)}</tspan>`)
    .join('')

  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}"${letterSpacingAttr}>${tspans}</text>`
}

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const title = normalizeQueryValue(query.title, 96) ?? SITE_NAME
  const subtitle = normalizeQueryValue(query.subtitle, 112)
  const section = normalizeQueryValue(query.section, 28)
  const readMoreUrl = normalizeQueryValue(query.url, 240)

  const titleLines = splitIntoLines(title, 28, 3)
  const subtitleLines = subtitle ? splitIntoLines(subtitle, 46, 2) : []
  const isPostCard = section?.toLowerCase() === 'post'
  const defaultReadMoreTarget = isPostCard ? `${SITE_LABEL}/feed/` : SITE_LABEL
  const readMoreTarget = readMoreUrl ? formatDisplayUrl(readMoreUrl) : defaultReadMoreTarget
  const readMoreText = withEllipsis(`Read more: ${readMoreTarget}`, 72)

  const sectionLabel = section?.toUpperCase() ?? ''
  const sectionPillX = 96
  const sectionPillY = 88
  const sectionPillHeight = 42
  const sectionPillWidth = Math.max(132, sectionLabel.length * 14 + 44)
  const sectionPillCenterX = sectionPillX + sectionPillWidth / 2
  const sectionPillCenterY = sectionPillY + sectionPillHeight / 2 + 1

  const sectionPill = section
    ? `<rect x="${sectionPillX}" y="${sectionPillY}" width="${sectionPillWidth}" height="${sectionPillHeight}" rx="21" fill="${ACCENT_COLOR}" fill-opacity="0.16" stroke="${ACCENT_COLOR}" stroke-opacity="0.5" />
<text x="${sectionPillCenterX}" y="${sectionPillCenterY}" fill="${ACCENT_COLOR}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" letter-spacing="0.7" text-anchor="middle" dominant-baseline="middle">${escapeSvgText(sectionLabel)}</text>`
    : ''

  const titleY = subtitle ? 256 : 292
  const titleMarkup = renderTextLines(titleLines, {
    x: 96,
    y: titleY,
    fontSize: 74,
    lineHeight: 88,
    fontWeight: 700,
    fill: '#E9F4F3'
  })

  const subtitleMarkup = subtitle
    ? renderTextLines(subtitleLines, {
        x: 98,
        y: 510,
        fontSize: 34,
        lineHeight: 44,
        fontWeight: 500,
        fill: '#9FB9B5'
      })
    : ''

  const siteLabelMarkup = renderTextLines([readMoreText], {
    x: 96,
    y: 568,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: 600,
    fill: ACCENT_COLOR,
    letterSpacing: 0.4
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" role="img" aria-label="Social preview image">
<defs>
  <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#060B12" />
    <stop offset="100%" stop-color="${BG_COLOR}" />
  </linearGradient>
</defs>
<rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bgGradient)" />
<rect x="72" y="52" width="8" height="526" rx="4" fill="${ACCENT_COLOR}" />
${sectionPill}
${titleMarkup}
${subtitleMarkup}
${siteLabelMarkup}
</svg>`

  const edgeMaxAge = CACHE.STALE_WHILE_REVALIDATE_SECONDS
  setHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', `public, max-age=0, s-maxage=${edgeMaxAge}, stale-while-revalidate=${edgeMaxAge}`)
  setHeader(event, 'CDN-Cache-Control', `public, max-age=${edgeMaxAge}`)
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  return svg
})

import { requireSiteUrl } from '~/utils/site-url'

export interface SocialImageParams {
  title?: string
  subtitle?: string
  section?: string
  url?: string
}

const SOCIAL_IMAGE_PATH = '/og.svg'

function normalizeParam(value: string | undefined, maxLength: number): string | null {
  const normalized = value?.replace(/\s+/g, ' ').trim()
  if (!normalized) return null
  return normalized.slice(0, maxLength)
}

export function getSocialImagePath(params: SocialImageParams = {}): string {
  const query = new URLSearchParams()

  const title = normalizeParam(params.title, 140)
  const subtitle = normalizeParam(params.subtitle, 180)
  const section = normalizeParam(params.section, 48)
  const url = normalizeParam(params.url, 240)

  if (title) query.set('title', title)
  if (subtitle) query.set('subtitle', subtitle)
  if (section) query.set('section', section)
  if (url) query.set('url', url)

  const queryString = query.toString()
  return queryString ? `${SOCIAL_IMAGE_PATH}?${queryString}` : SOCIAL_IMAGE_PATH
}

export function getSocialImageUrl(siteUrl: string | undefined, params: SocialImageParams = {}): string {
  const base = requireSiteUrl(siteUrl)
  return `${base}${getSocialImagePath(params)}`
}

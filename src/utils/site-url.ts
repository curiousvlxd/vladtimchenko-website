const MISSING_SITE_URL_ERROR =
  'runtimeConfig.public.siteUrl must be configured'

export function requireSiteUrl(value: string | undefined): string {
  const siteUrl = value?.trim()

  if (!siteUrl) {
    throw new Error(MISSING_SITE_URL_ERROR)
  }

  return siteUrl.replace(/\/+$/, '')
}

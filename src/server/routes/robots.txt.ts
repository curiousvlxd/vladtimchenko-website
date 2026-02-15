import { requireSiteUrl } from '~/utils/site-url'
import { CACHE } from '~/common/constants/runtime/cache'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const base = requireSiteUrl(config.public?.siteUrl)
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', `public, max-age=${CACHE.DEFAULT_MAX_AGE_SECONDS}`)
  return `User-agent: *
Allow: /

Host: ${base}
Sitemap: ${base}/sitemap.xml
Sitemap: ${base}/rss.xml
`
})

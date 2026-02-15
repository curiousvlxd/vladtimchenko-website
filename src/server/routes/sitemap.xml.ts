import { serverQueryContent } from '#content/server'
import { requireSiteUrl } from '~/utils/site-url'
import { CACHE } from '~/common/constants/runtime/cache'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', `public, max-age=${CACHE.DEFAULT_MAX_AGE_SECONDS}`)
  const config = useRuntimeConfig(event)
  const base = requireSiteUrl(config.public?.siteUrl)
  const { SITEMAP_PATHS } = await import('~/features/navigation/constants')
  const today = new Date().toISOString().slice(0, 10)
  const staticMeta: Record<string, { changefreq: string; priority: string }> = {
    '/': { changefreq: 'weekly', priority: '1.0' },
    '/cv': { changefreq: 'monthly', priority: '0.9' },
    '/feed': { changefreq: 'weekly', priority: '0.8' }
  }
  const staticUrls = SITEMAP_PATHS.map((p) => {
    const meta = staticMeta[p] ?? { changefreq: 'weekly', priority: '0.7' }
    return `<url><loc>${base}${p}</loc><lastmod>${today}</lastmod><changefreq>${meta.changefreq}</changefreq><priority>${meta.priority}</priority></url>`
  })
  let paths: string[] = []
  try {
    const posts = await serverQueryContent(event)
      .where({ _path: /^\/?feed\// })
      .only(['_path', 'date'])
      .find()
    paths = (posts as Array<{ _path: string; date?: string }>).map((p) => {
      const path = p._path.startsWith('/') ? p._path : `/${p._path}`
      const lastmod = p.date ? new Date(p.date).toISOString().slice(0, 10) : ''
      return `<url><loc>${base}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>monthly</changefreq><priority>0.7</priority></url>`
    })
  } catch {
    paths = []
  }
  const urls = [...staticUrls, ...paths]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`
})

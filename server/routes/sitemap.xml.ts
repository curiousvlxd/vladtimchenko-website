export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  const config = useRuntimeConfig(event)
  const base = config.public?.siteUrl || 'https://vladtimchenko.dev'
  let paths: string[] = []
  try {
    const posts = await queryContent('/feed').only(['_path', 'date']).find()
    paths = (posts as Array<{ _path: string; date?: string }>).map((p) => {
      const lastmod = p.date ? new Date(p.date).toISOString().slice(0, 10) : ''
      return `<url><loc>${base}${p._path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
    })
  } catch {
    paths = []
  }
  const { STATIC_PATHS } = await import('~/constants/navigation')
  const staticUrls = STATIC_PATHS.map(
    (p) => `<url><loc>${base}${p || '/'}</loc></url>`
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.join('\n  ')}
  ${paths.join('\n  ')}
</urlset>`
})

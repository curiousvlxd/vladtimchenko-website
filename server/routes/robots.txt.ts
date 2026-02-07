export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const base = config.public?.siteUrl || 'https://vladtimchenko.dev'
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
})

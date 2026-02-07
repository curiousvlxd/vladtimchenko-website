export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  const config = useRuntimeConfig(event)
  const base = config.public?.siteUrl || 'https://vladtimchenko.dev'
  let items = ''
  try {
    const posts = await queryContent('/blog').sort({ date: -1 }).limit(50).find()
    items = (posts as Array<{ _path: string; title?: string; description?: string; date?: string }>)
      .map((p) => {
        const date = p.date ? new Date(p.date).toUTCString() : ''
        const link = `${base}${p._path}`
        const title = p.title ?? 'Post'
        const desc = p.description ?? ''
        return `<item><title>${escapeXml(title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${date}</pubDate><description>${escapeXml(desc)}</description></item>`
      })
      .join('')
  } catch {
    items = ''
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vlad Timchenko - Blog</title>
    <link>${base}/blog</link>
    <description>Software Engineer • Cloud-native .NET</description>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
})

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

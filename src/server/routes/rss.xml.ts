import { serverQueryContent } from '#content/server'
import { requireSiteUrl } from '~/utils/site-url'
import { CACHE } from '~/constants/runtime/cache'
import {
  FEED_META_TITLE,
  SITE_DESCRIPTION
} from '~/constants/app/site'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(
    event,
    'Cache-Control',
    `public, max-age=0, s-maxage=${CACHE.DEFAULT_MAX_AGE_SECONDS}, stale-while-revalidate=${CACHE.STALE_WHILE_REVALIDATE_SECONDS}`
  )
  const config = useRuntimeConfig(event)
  const base = requireSiteUrl(config.public?.siteUrl)
  let items = ''
  try {
    const posts = await serverQueryContent(event)
      .where({ _path: /^\/?feed\// })
      .sort({ date: -1 })
      .limit(50)
      .find()
    items = (posts as Array<{ _path: string; title?: string; description?: string; date?: string }>)
      .map((p) => {
        const date = p.date ? new Date(p.date).toUTCString() : ''
        const path = p._path.startsWith('/') ? p._path : `/${p._path}`
        const link = `${base}${path}`
        const title = p.title ?? 'Post'
        const desc = p.description ?? ''
        return `<item><title>${escapeXml(title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${date}</pubDate><description>${escapeXml(desc)}</description></item>`
      })
      .join('')
  } catch {
    items = ''
  }
  const lastBuildDate = new Date().toUTCString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${FEED_META_TITLE}</title>
    <link>${base}/feed</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
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

import { CACHE } from '~/common/constants/runtime/cache'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(
    event,
    'Cache-Control',
    `public, s-maxage=${CACHE.DEFAULT_MAX_AGE_SECONDS}, stale-while-revalidate`
  )

  const config = useRuntimeConfig(event)
  const siteRepo = config.githubSiteRepo
  const fallbackRepoUrl = (config.public.siteRepoUrl as string) || repoUrl(siteRepo as string)

  if (!siteRepo) {
    return { stars: 0, url: fallbackRepoUrl }
  }

  const res = await fetchRepo(siteRepo)

  if (res) {
    return { stars: res.stargazers_count, url: res.html_url }
  }

  return { stars: 0, url: fallbackRepoUrl }
})

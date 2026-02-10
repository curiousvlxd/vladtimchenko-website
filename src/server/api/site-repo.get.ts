const CACHE_MAX_AGE = 3600

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`)

  const config = useRuntimeConfig(event)
  const siteRepo = config.githubSiteRepo
  if (!siteRepo) {
    return { stars: 0, url: config.public.siteRepoUrl || '' }
  }
  const res = await fetchRepo(siteRepo)
  if (res) {
    return { stars: res.stargazers_count, url: res.html_url }
  }
  return { stars: 0, url: repoUrl(siteRepo) }
})

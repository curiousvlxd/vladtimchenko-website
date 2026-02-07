const FEATURED_REPOS = [
  'curiousvlxd/linkedin-badge-renderer',
  'curiousvlxd/sentinel',
  'curiousvlxd/well-insight-engine-backend',
  'curiousvlxd/meety-backend',
  'curiousvlxd/WellBites',
  'curiousvlxd/gruvbox-ua-iterm'
] as const

const CACHE_MAX_AGE = 3600

interface RepoMeta {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  html_url: string
  homepage: string | null
}

export default defineEventHandler(async (event): Promise<RepoMeta[]> => {
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`)
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'vladtimchenko'
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const results: RepoMeta[] = []
  for (const repo of FEATURED_REPOS) {
    try {
      const res = await $fetch<{
        name: string
        description: string | null
        stargazers_count: number
        forks_count: number
        language: string | null
        topics?: string[]
        updated_at: string
        html_url: string
        homepage: string | null
      }>(`https://api.github.com/repos/${repo}`, { headers })
      results.push({
        name: res.name,
        description: res.description,
        stargazers_count: res.stargazers_count,
        forks_count: res.forks_count,
        language: res.language,
        topics: res.topics || [],
        updated_at: res.updated_at,
        html_url: res.html_url,
        homepage: res.homepage || null
      })
    } catch {
      results.push({
        name: repo.split('/')[1],
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        updated_at: new Date().toISOString(),
        html_url: `https://github.com/${repo}`,
        homepage: null
      })
    }
  }
  return results
})

import type { GitHubRepoResponse } from '../utils/github'

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

function toRepoMeta(fullName: string, res: GitHubRepoResponse | null): RepoMeta {
  if (!res) {
    return {
      name: fullName.split('/')[1],
      description: null,
      stargazers_count: 0,
      forks_count: 0,
      language: null,
      topics: [],
      updated_at: new Date().toISOString(),
      html_url: repoUrl(fullName),
      homepage: null
    }
  }
  return {
    name: res.name,
    description: res.description,
    stargazers_count: res.stargazers_count,
    forks_count: res.forks_count,
    language: res.language,
    topics: res.topics ?? [],
    updated_at: res.updated_at,
    html_url: res.html_url,
    homepage: res.homepage ?? null
  }
}

export default defineEventHandler(async (event): Promise<RepoMeta[]> => {
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`)

  const results: RepoMeta[] = []
  for (const fullName of FEATURED_REPOS) {
    const res = await fetchRepo(fullName)
    results.push(toRepoMeta(fullName, res))
  }
  return results
})

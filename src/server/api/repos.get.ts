import type { GitHubRepoResponse } from '../utils/github'
import { CACHE } from '~/common/constants/runtime/cache'
import { FEATURED_REPOS } from '~/features/repos/constants'

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
  setHeader(
    event,
    'Cache-Control',
    `public, s-maxage=${CACHE.DEFAULT_MAX_AGE_SECONDS}, stale-while-revalidate`
  )

  return Promise.all(
    FEATURED_REPOS.map(async (fullName) => {
      const res = await fetchRepo(fullName)
      return toRepoMeta(fullName, res)
    })
  )
})

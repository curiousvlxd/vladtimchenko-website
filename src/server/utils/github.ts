const GITHUB_API = 'https://api.github.com'
const GITHUB_REQUEST_TIMEOUT_MS = 3000

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'vladtimchenko'
  }

  const { githubToken } = useRuntimeConfig()
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`
  return headers
}

export interface GitHubRepoResponse {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics?: string[]
  updated_at: string
  html_url: string
  homepage: string | null
}

export async function fetchRepo(fullName: string): Promise<GitHubRepoResponse | null> {
  try {
    return await $fetch<GitHubRepoResponse>(`${GITHUB_API}/repos/${fullName}`, {
      headers: getHeaders(),
      timeout: GITHUB_REQUEST_TIMEOUT_MS
    })
  } catch {
    return null
  }
}

export function repoUrl(fullName: string): string {
  return `https://github.com/${fullName}`
}

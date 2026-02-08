const GITHUB_API = 'https://api.github.com'

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'vladtimchenko'
  }
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
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
      headers: getHeaders()
    })
  } catch {
    return null
  }
}

export function repoUrl(fullName: string): string {
  return `https://github.com/${fullName}`
}

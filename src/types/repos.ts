export interface RepoMeta {
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

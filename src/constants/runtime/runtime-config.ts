import { PUBLIC_ASSETS } from '../app/public-assets'

export const DEFAULT_GITHUB_SITE_REPO = 'curiousvlxd/vladtimchenko-website' as const

export const DEFAULT_SITE_URL = 'https://vladtimchenko.dev' as const

export const DEFAULT_SITE_REPO_URL =
  `https://github.com/${DEFAULT_GITHUB_SITE_REPO}` as const

export const DEFAULT_GISCUS_REPO = DEFAULT_GITHUB_SITE_REPO
export const DEFAULT_GISCUS_REPO_ID = 'R_kgDORK_eZw' as const
export const DEFAULT_GISCUS_CATEGORY = 'Announcements' as const
export const DEFAULT_GISCUS_CATEGORY_ID = 'DIC_kwDORK_eZ84C2ECR' as const
export const DEFAULT_GISCUS_THEME_PATH = PUBLIC_ASSETS.GISCUS_THEME

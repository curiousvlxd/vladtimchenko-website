export const ASSETS = {
  LOGO: '/logo.svg',
  LOGO_WHITE: '/logo.svg',
  PHOTO: '/me.jpg'
} as const

export const CRITICAL_ASSETS = [ASSETS.LOGO, ASSETS.PHOTO] as const

export const CONTACT = {
  EMAIL: 'vlxdtimchenko@gmail.com',
  GITHUB: 'https://github.com/curiousvlxd',
  LINKEDIN: 'https://www.linkedin.com/in/vladtimchenko/',
  TELEGRAM: 'https://t.me/curiousvlxd'
} as const

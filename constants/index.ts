export const ASSETS = {
  LOGO_WHITE: '/brand/vladtimchenko-white-logo.svg',
  LOGO: '/brand/vladtimchenko-logo.svg',
  PHOTO: '/me.jpg'
} as const

export const CRITICAL_ASSETS = [ASSETS.LOGO_WHITE, ASSETS.PHOTO] as const

export const CONTACT = {
  EMAIL: 'vlxdtimchenko@gmail.com',
  GITHUB: 'https://github.com/curiousvlxd',
  LINKEDIN: 'https://www.linkedin.com/in/vladtimchenko/',
  TELEGRAM: 'https://t.me/curiousvlxd'
} as const

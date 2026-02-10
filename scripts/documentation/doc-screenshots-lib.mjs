export const VIEWPORT = { width: 1280, height: 800 }
export const VIEWPORT_ABOUT = { width: 1280, height: 1100 }
export const DEVICE_SCALE_FACTOR = 2

export const HOME_SECTIONS = ['about', 'experience', 'volunteering', 'education', 'testimonials', 'projects', 'contact']

const DEVMODS_SELECTORS = [
  '[id*="nuxt-devtools"]',
  '[id*="devtools"]',
  '[class*="nuxt-devtools"]',
  '[data-v-inspector]',
  'iframe[src*="__devtools__"]',
  'iframe[title*="Nuxt"]',
  '[style*="position: fixed"][style*="z-index: 9999"]',
  '#nuxt-devtools-container',
  '.nuxt-devtools'
]

export async function hideDevtools(page) {
  await page.evaluate((selList) => {
    selList.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => el.remove())
      } catch (_) {}
    })
    document.querySelectorAll('[data-v-inspector]').forEach((el) => el.removeAttribute('data-v-inspector'))
  }, DEVMODS_SELECTORS)
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

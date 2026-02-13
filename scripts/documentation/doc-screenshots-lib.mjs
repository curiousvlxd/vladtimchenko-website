export const VIEWPORT = { width: 1280, height: 800 }
export const VIEWPORT_ABOUT = { width: 1280, height: 1100 }
export const DEVICE_SCALE_FACTOR = 2
export const DEFAULT_BASE_URL = 'http://localhost:3000'
export const SCREENSHOT_FRAME = {
  inset: 12,
  radius: 16,
  borderColor: 'rgba(24, 183, 164, 0.3)',
  shadow: '0 16px 34px rgba(0,0,0,0.24), inset 0 0 0 1px rgba(24,183,164,0.12)'
}

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

export async function applyScreenshotFrame(page) {
  await page.evaluate((frame) => {
    const styleId = 'doc-screenshot-frame-style'
    let style = document.getElementById(styleId)
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }

    const rootCandidates = ['#__nuxt', '#__layout', '[data-v-app]', 'body > div:first-child']
    const appRoot = rootCandidates
      .map((selector) => document.querySelector(selector))
      .find((node) => node instanceof HTMLElement)

    if (!(appRoot instanceof HTMLElement)) return

    document.documentElement.setAttribute('data-doc-screenshot-frame', '1')
    appRoot.setAttribute('data-doc-screenshot-root', '1')

    style.textContent = `
      html[data-doc-screenshot-frame='1'],
      html[data-doc-screenshot-frame='1'] body {
        background: transparent !important;
      }

      html[data-doc-screenshot-frame='1'] body {
        margin: 0 !important;
        padding: ${frame.inset}px !important;
        box-sizing: border-box !important;
      }

      html[data-doc-screenshot-frame='1'] [data-doc-screenshot-root='1'] {
        min-height: calc(100vh - ${frame.inset * 2}px) !important;
        border-radius: ${frame.radius}px !important;
        overflow: hidden !important;
        border: 1px solid ${frame.borderColor} !important;
        box-shadow: ${frame.shadow} !important;
      }

      html[data-doc-screenshot-frame='1'] .layout-footer {
        left: ${frame.inset}px !important;
        right: ${frame.inset}px !important;
        bottom: ${frame.inset}px !important;
      }
    `
  }, SCREENSHOT_FRAME)
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

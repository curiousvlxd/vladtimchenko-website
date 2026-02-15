export const VIEWPORT = { width: 1280, height: 800 }
export const VIEWPORT_ABOUT = { width: 1280, height: 1100 }
export const DEVICE_SCALE_FACTOR = 2
export const DEFAULT_BASE_URL = 'http://localhost:3000'
export const SCREENSHOT_FINAL_CROP = {
  radius: 32
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

export async function applyScreenshotLayout(page) {
  await page.evaluate(() => {
    const styleId = 'doc-screenshot-layout-style'
    let style = document.getElementById(styleId)
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }

    document.documentElement.setAttribute('data-doc-screenshot-layout', '1')

    style.textContent = `
      html[data-doc-screenshot-layout='1'] {
        scrollbar-gutter: auto !important;
      }

      html[data-doc-screenshot-layout='1'],
      html[data-doc-screenshot-layout='1'] body {
        scrollbar-width: none !important;
      }

      html[data-doc-screenshot-layout='1']::-webkit-scrollbar,
      html[data-doc-screenshot-layout='1'] body::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
      }
    `
  })
}

export async function saveFinalRoundedScreenshot(buffer, outPath, viewport, options = SCREENSHOT_FINAL_CROP) {
  const sharp = (await import('sharp')).default
  const source = sharp(buffer)
  const metadata = await source.metadata()

  if (!metadata.width || !metadata.height || !viewport?.width || !viewport?.height) {
    await source.png().toFile(outPath)
    return
  }

  const scaleX = metadata.width / viewport.width
  const scaleY = metadata.height / viewport.height
  const radiusPx = Math.max(0, Math.round(options.radius * Math.min(scaleX, scaleY)))

  const cropWidth = Math.max(1, metadata.width)
  const cropHeight = Math.max(1, metadata.height)

  const maskSvg = Buffer.from(
    `<svg width="${cropWidth}" height="${cropHeight}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${cropWidth}" height="${cropHeight}" rx="${radiusPx}" ry="${radiusPx}" fill="#fff"/></svg>`
  )

  await source
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toFile(outPath)
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

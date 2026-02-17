const SECONDARY_FONT_LINK_ID = 'vt-secondary-fonts'

function appendSecondaryFonts(href: string) {
  if (!href || document.getElementById(SECONDARY_FONT_LINK_ID)) return

  const link = document.createElement('link')
  link.id = SECONDARY_FONT_LINK_ID
  link.rel = 'stylesheet'
  link.href = href
  link.media = 'print'
  link.onload = () => {
    link.media = 'all'
  }
  document.head.appendChild(link)
}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const { public: { secondaryFontsStylesheet } } = useRuntimeConfig()
  const href = String(secondaryFontsStylesheet ?? '')
  if (!href) return

  const load = () => {
    appendSecondaryFonts(href)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load, { timeout: 2000 })
    return
  }

  window.setTimeout(load, 800)
})

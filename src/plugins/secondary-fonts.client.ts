const SECONDARY_FONT_LINK_ID = 'vt-secondary-fonts'
const WAIT_AFTER_LOAD_MS = 4500
const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'pointerdown',
  'keydown',
  'touchstart',
  'wheel'
]

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

  let loaded = false
  let delayedTimer: ReturnType<typeof setTimeout> | null = null

  const loadDuringIdle = () => {
    delayedTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(load, { timeout: 1500 })
        return
      }

      load()
    }, WAIT_AFTER_LOAD_MS)
  }

  const load = () => {
    if (loaded) return
    loaded = true
    if (delayedTimer) {
      clearTimeout(delayedTimer)
      delayedTimer = null
    }
    window.removeEventListener('load', loadDuringIdle)
    INTERACTION_EVENTS.forEach((eventName) => {
      window.removeEventListener(eventName, load)
    })
    appendSecondaryFonts(href)
  }

  INTERACTION_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, load, { once: true, passive: true })
  })

  if (document.readyState === 'complete') {
    loadDuringIdle()
    return
  }

  window.addEventListener('load', loadDuringIdle, { once: true })
})

import { preloadRouteComponents } from '#app'
import { PAGES } from '~/features/navigation/constants'

interface NavigatorConnection {
  effectiveType?: string
  saveData?: boolean
}

function shouldSkipWarmup() {
  if (typeof window === 'undefined') return true

  const nav = navigator as Navigator & { connection?: NavigatorConnection }
  const connection = nav.connection
  const isSmallViewport = window.matchMedia('(max-width: 1023px)').matches
  const isSlowConnection = Boolean(
    connection?.saveData ||
      (connection?.effectiveType && /(^2g$|^slow-2g$|^3g$)/.test(connection.effectiveType))
  )

  return isSmallViewport || isSlowConnection
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  if (shouldSkipWarmup()) return

  const router = nuxtApp.$router
  const warmed = new Set<string>()
  const paths = PAGES.map((page) => page.to)

  const warmPath = async (path: string) => {
    if (warmed.has(path)) return
    warmed.add(path)
    try {
      await preloadRouteComponents(path)
    } catch {
      warmed.delete(path)
    }
  }

  const warmNeighbors = () => {
    const currentPath = router.currentRoute.value.path
    paths
      .filter((path) => path !== currentPath)
      .forEach((path) => {
        void warmPath(path)
      })
  }

  const scheduleWarmup = () => {
    const run = () => {
      void warmNeighbors()
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 3000 })
      return
    }

    window.setTimeout(run, 1200)
  }

  let interacted = false
  const interactionEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart']

  const onFirstInteraction = () => {
    if (interacted) return
    interacted = true
    interactionEvents.forEach((eventName) => {
      window.removeEventListener(eventName, onFirstInteraction)
    })
    scheduleWarmup()
  }

  interactionEvents.forEach((eventName) => {
    window.addEventListener(eventName, onFirstInteraction, { once: true, passive: true })
  })

  router.afterEach(() => {
    if (!interacted) return
    scheduleWarmup()
  })
})

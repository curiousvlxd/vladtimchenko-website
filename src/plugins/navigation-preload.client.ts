import { preloadRouteComponents } from '#app'
import { PAGES } from '~/features/navigation/constants'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

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

  const startWarmup = () => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        warmNeighbors()
      }, { timeout: 1200 })
      return
    }

    window.setTimeout(() => {
      warmNeighbors()
    }, 200)
  }

  startWarmup()

  router.afterEach(() => {
    warmNeighbors()
  })
})

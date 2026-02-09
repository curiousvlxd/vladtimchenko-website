import { TESTIMONIAL_CONSTANTS } from '../constants/testimonials'

export function useAutoplay(onNext: () => void) {
  let autoplayInterval: ReturnType<typeof setInterval> | null = null

  function startAutoplay() {
    if (import.meta.server) return
    stopAutoplay()
    autoplayInterval = setInterval(() => {
      onNext()
    }, TESTIMONIAL_CONSTANTS.AUTOPLAY_INTERVAL)
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval)
      autoplayInterval = null
    }
  }

  onUnmounted(() => {
    stopAutoplay()
  })

  return {
    startAutoplay,
    stopAutoplay
  }
}

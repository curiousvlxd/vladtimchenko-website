import { TESTIMONIAL_CONSTANTS } from '~/constants/testimonials/testimonials'

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = ref(0)
  const touchEndX = ref(0)

  function handleTouchStart(e: TouchEvent) {
    touchStartX.value = e.touches[0].clientX
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndX.value = e.touches[0].clientX
  }

  function handleTouchEnd() {
    if (!touchStartX.value || !touchEndX.value) return

    const diff = touchStartX.value - touchEndX.value

    if (Math.abs(diff) > TESTIMONIAL_CONSTANTS.MIN_SWIPE_DISTANCE) {
      if (diff > 0) {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    }

    touchStartX.value = 0
    touchEndX.value = 0
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}


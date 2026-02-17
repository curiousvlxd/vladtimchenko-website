import { TESTIMONIAL_CONSTANTS } from '~/features/testimonials/constants'

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchCurrentX = ref(0)
  const touchStartAt = ref(0)

  function handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    touchStartX.value = touch.clientX
    touchStartY.value = touch.clientY
    touchCurrentX.value = touch.clientX
    touchStartAt.value = Date.now()
  }

  function handleTouchMove(e: TouchEvent) {
    touchCurrentX.value = e.touches[0].clientX
  }

  function reset() {
    touchStartX.value = 0
    touchStartY.value = 0
    touchCurrentX.value = 0
    touchStartAt.value = 0
  }

  function handleTouchEnd(e: TouchEvent) {
    if (!touchStartAt.value) return

    const touch = e.changedTouches[0]
    const endX = touch?.clientX ?? touchCurrentX.value
    const endY = touch?.clientY ?? touchStartY.value
    const diffX = touchStartX.value - endX
    const diffY = Math.abs(touchStartY.value - endY)
    const durationMs = Date.now() - touchStartAt.value

    const isHorizontalSwipe =
      diffY <= TESTIMONIAL_CONSTANTS.MAX_VERTICAL_SWIPE_DISTANCE &&
      durationMs <= TESTIMONIAL_CONSTANTS.MAX_SWIPE_DURATION_MS &&
      Math.abs(diffX) >= TESTIMONIAL_CONSTANTS.MIN_SWIPE_DISTANCE

    if (!isHorizontalSwipe) {
      reset()
      return
    }

    if (diffX > 0) {
      onSwipeLeft()
    } else {
      onSwipeRight()
    }

    reset()
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}


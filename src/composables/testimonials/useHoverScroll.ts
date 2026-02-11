import { TESTIMONIAL_CONSTANTS } from '~/constants/testimonials/testimonials'

export function useHoverScroll(
  containerRef: ComputedRef<HTMLElement | null>,
  isMobile: Ref<boolean>,
  currentIndex: Ref<number>,
  maxIndex: ComputedRef<number>,
  onScrollLeft: () => void,
  onScrollRight: () => void
) {
  const isHoveringLeft = ref(false)
  let hoverScrollInterval: ReturnType<typeof setInterval> | null = null

  function startHoverScroll(direction: 'left' | 'right') {
    if (import.meta.server) return
    stopHoverScroll()
    hoverScrollInterval = setInterval(() => {
      if (direction === 'left' && currentIndex.value > 0) {
        onScrollLeft()
      } else if (direction === 'right' && currentIndex.value < maxIndex.value) {
        onScrollRight()
      } else {
        stopHoverScroll()
      }
    }, TESTIMONIAL_CONSTANTS.HOVER_SCROLL_INTERVAL)
  }

  function stopHoverScroll() {
    if (hoverScrollInterval) {
      clearInterval(hoverScrollInterval)
      hoverScrollInterval = null
    }
    isHoveringLeft.value = false
  }

  function handleMouseEnter() {
    isHoveringLeft.value = false
    stopHoverScroll()
  }

  function handleMouseLeave() {
    isHoveringLeft.value = false
    stopHoverScroll()
  }

  function handleMouseMove(e: MouseEvent) {
    if (!containerRef.value || isMobile.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const containerWidth = rect.width
    const leftThreshold = containerWidth * TESTIMONIAL_CONSTANTS.LEFT_HOVER_THRESHOLD

    if (mouseX < leftThreshold && currentIndex.value > 0) {
      if (!isHoveringLeft.value) {
        isHoveringLeft.value = true
        startHoverScroll('left')
      }
    } else {
      if (isHoveringLeft.value) {
        isHoveringLeft.value = false
        stopHoverScroll()
      }
    }
  }

  onUnmounted(() => {
    stopHoverScroll()
  })

  return {
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove
  }
}


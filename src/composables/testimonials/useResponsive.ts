import { TESTIMONIAL_CONSTANTS } from '~/constants/testimonials/testimonials'

export function useResponsive() {
  const isMobile = ref(false)
  const isTablet = ref(false)

  function updateResponsive() {
    if (typeof window === 'undefined') return
    
    const width = window.innerWidth
    isMobile.value = width < TESTIMONIAL_CONSTANTS.MOBILE_BREAKPOINT
    isTablet.value =
      width >= TESTIMONIAL_CONSTANTS.MOBILE_BREAKPOINT &&
      width < TESTIMONIAL_CONSTANTS.TABLET_BREAKPOINT
  }

  onMounted(() => {
    updateResponsive()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateResponsive)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateResponsive)
    }
  })

  return {
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    updateResponsive
  }
}


export function useResponsive() {
  const isMobile = ref(false)
  const isTablet = ref(false)

  function updateResponsive() {
    if (typeof window === 'undefined') return
    
    const width = window.innerWidth
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
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

export function useBreakpoint(breakpointPx: number) {
  const isBelowBreakpoint = ref(false)

  function update() {
    if (!import.meta.client || typeof window === 'undefined') return

    isBelowBreakpoint.value = window.innerWidth < breakpointPx
  }

  onMounted(() => {
    if (!import.meta.client || typeof window === 'undefined') return

    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    if (!import.meta.client || typeof window === 'undefined') return

    window.removeEventListener('resize', update)
  })

  return isBelowBreakpoint
}

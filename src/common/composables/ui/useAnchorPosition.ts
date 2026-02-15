export function useAnchorPosition(
  anchorRef: Ref<HTMLElement | null>,
  isActive: Ref<boolean>
) {
  const anchorRect = ref<DOMRect | null>(null)

  let rafId: number | null = null

  function updatePosition() {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      if (isActive.value && anchorRef.value) {
        anchorRect.value = anchorRef.value.getBoundingClientRect()
      }
    })
  }

  function addListeners() {
    if (import.meta.client && typeof window !== 'undefined') {
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }
  }

  function removeListeners() {
    if (import.meta.client && typeof window !== 'undefined') {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }

  watch(isActive, (active) => {
    if (active) {
      if (anchorRef.value) anchorRect.value = anchorRef.value.getBoundingClientRect()
      addListeners()
    } else {
      removeListeners()
      anchorRect.value = null
    }
  })

  onUnmounted(() => {
    removeListeners()
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return anchorRect
}

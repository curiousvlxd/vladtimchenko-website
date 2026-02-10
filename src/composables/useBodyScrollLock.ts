export function useBodyScrollLock(isOpen: Ref<boolean>) {
  let savedScrollY = 0

  watch(
    isOpen,
    (open) => {
      if (!import.meta.client || typeof document === 'undefined') return
      if (open) {
        savedScrollY = window.scrollY ?? window.pageYOffset ?? 0
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${savedScrollY}px`
        document.body.style.width = '100%'
      } else {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo({ top: savedScrollY })
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (!import.meta.client || typeof document === 'undefined') return
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })
}

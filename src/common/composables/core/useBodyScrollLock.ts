let activeBodyScrollLocks = 0

function syncBodyOverflow() {
  if (!import.meta.client || typeof document === 'undefined') return

  document.body.style.overflow = activeBodyScrollLocks > 0 ? 'hidden' : ''
}

export function useBodyScrollLock(isOpen: Ref<boolean>) {
  let hasLock = false

  function canUseDocument(): boolean {
    return Boolean(import.meta.client) && typeof document !== 'undefined'
  }

  function lock() {
    if (hasLock || !canUseDocument()) return

    hasLock = true
    activeBodyScrollLocks += 1
    syncBodyOverflow()
  }

  function unlock() {
    if (!hasLock || !canUseDocument()) return

    hasLock = false
    activeBodyScrollLocks = Math.max(0, activeBodyScrollLocks - 1)
    syncBodyOverflow()
  }

  watch(
    isOpen,
    (open) => {
      if (open) {
        lock()
        return
      }

      unlock()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    unlock()
  })
}

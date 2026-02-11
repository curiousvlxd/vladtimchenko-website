export function useEscapeKey(
  onEscape: () => void,
  isEnabledRef: Ref<boolean> = ref(true)
) {
  let isListening = false

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onEscape()
    }
  }

  function startListening() {
    if (
      isListening ||
      !import.meta.client ||
      typeof document === 'undefined'
    ) {
      return
    }

    isListening = true
    document.addEventListener('keydown', onKeydown)
  }

  function stopListening() {
    if (
      !isListening ||
      !import.meta.client ||
      typeof document === 'undefined'
    ) {
      return
    }

    isListening = false
    document.removeEventListener('keydown', onKeydown)
  }

  watch(
    isEnabledRef,
    (isEnabled) => {
      if (isEnabled) {
        startListening()
        return
      }

      stopListening()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    stopListening()
  })
}

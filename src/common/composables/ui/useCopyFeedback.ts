export function useCopyFeedback(resetAfterMs: number) {
  const copied = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function setCopied() {
    copied.value = true
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      copied.value = false
      timeoutId = null
    }, resetAfterMs)
  }

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  return { copied, setCopied }
}

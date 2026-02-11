export function useTextareaAutoResize(maxHeightPx: number, minHeightPx = 0) {
  const textareaRef = ref<HTMLTextAreaElement | null>(null)

  function adjustTextareaHeight() {
    const textarea = textareaRef.value

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.max(minHeightPx, Math.min(textarea.scrollHeight, maxHeightPx))}px`
  }

  return {
    textareaRef,
    adjustTextareaHeight
  }
}

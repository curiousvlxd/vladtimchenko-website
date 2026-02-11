import { BOTTOM_SHEET_RULES } from '~/constants/navigation/bottom-sheet'

export interface BottomSheetDragRules {
  CLOSE_ON_DRAG_RATIO: number
  SNAP_BACK_RATIO: number
  SNAP_BACK_DURATION_MS: number
}

export interface UseBottomSheetDragOptions {
  excludeRef?: Ref<HTMLElement | null>
  rules?: BottomSheetDragRules
}

export function shouldCloseByDrag(
  offsetPx: number,
  heightPx: number,
  rules: BottomSheetDragRules
): boolean {
  return heightPx > 0 && offsetPx >= heightPx * rules.CLOSE_ON_DRAG_RATIO
}

export function shouldSnapBack(
  offsetPx: number,
  heightPx: number,
  rules: BottomSheetDragRules
): boolean {
  return heightPx > 0 && offsetPx >= heightPx * rules.SNAP_BACK_RATIO
}

export function useBottomSheetDrag(
  contentRef: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  onClose: () => void,
  options: UseBottomSheetDragOptions = {}
) {
  const rules = options.rules ?? BOTTOM_SHEET_RULES
  const excludeRef = options.excludeRef

  const dragStartY = ref(0)
  const dragStartContentY = ref(0)
  const contentHeight = ref(0)
  const dragOffset = ref(0)
  const isDragging = ref(false)

  const activePointerId = ref<number | null>(null)
  const pointerCaptureTarget = ref<HTMLElement | null>(null)

  let currentContentEl: HTMLElement | null = null
  let resetTimeout: ReturnType<typeof setTimeout> | null = null

  function clearResetTimeout() {
    if (!resetTimeout) return

    clearTimeout(resetTimeout)
    resetTimeout = null
  }

  function scheduleResetIfClosed() {
    clearResetTimeout()

    resetTimeout = setTimeout(() => {
      if (!isOpen.value) {
        dragOffset.value = 0
      }
    }, rules.SNAP_BACK_DURATION_MS)
  }

  function getContentHeight(): number {
    const el = contentRef.value

    return el ? el.offsetHeight : 0
  }

  function releasePointerCapture() {
    const target = pointerCaptureTarget.value
    const pointerId = activePointerId.value

    if (!target || pointerId === null) return

    try {
      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId)
      }
    } catch {
      // Ignore release errors for already-released pointers.
    }
  }

  function resetDragState() {
    releasePointerCapture()

    isDragging.value = false
    activePointerId.value = null
    pointerCaptureTarget.value = null
  }

  function endDrag(shouldCloseOnRelease: boolean) {
    if (!isDragging.value) return

    if (shouldCloseOnRelease && shouldSnapBack(dragOffset.value, contentHeight.value, rules)) {
      onClose()
      scheduleResetIfClosed()
    } else {
      dragOffset.value = 0
    }

    resetDragState()
  }

  function onPointerMove(event: PointerEvent) {
    if (!isDragging.value || activePointerId.value !== event.pointerId) return

    if (event.cancelable) {
      event.preventDefault()
    }

    const deltaY = event.clientY - dragStartY.value
    const nextOffset = Math.max(0, dragStartContentY.value + deltaY)

    dragOffset.value = nextOffset

    if (shouldCloseByDrag(nextOffset, contentHeight.value, rules)) {
      onClose()
      scheduleResetIfClosed()
      endDrag(false)
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (activePointerId.value !== event.pointerId) return

    endDrag(true)
  }

  function onPointerCancel(event: PointerEvent) {
    if (activePointerId.value !== event.pointerId) return

    endDrag(false)
  }

  function attachContentListeners(el: HTMLElement) {
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)
    el.addEventListener('lostpointercapture', onPointerCancel)
  }

  function detachContentListeners(el: HTMLElement) {
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerCancel)
    el.removeEventListener('lostpointercapture', onPointerCancel)
  }

  function startDrag(event: PointerEvent) {
    if (!isOpen.value || !event.isPrimary) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const target = event.target as Node | null

    if (excludeRef?.value && target && excludeRef.value.contains(target)) {
      return
    }

    const captureTarget =
      event.currentTarget instanceof HTMLElement
        ? event.currentTarget
        : contentRef.value

    if (!captureTarget) return

    try {
      captureTarget.setPointerCapture(event.pointerId)
      pointerCaptureTarget.value = captureTarget
    } catch {
      pointerCaptureTarget.value = null
    }

    isDragging.value = true
    activePointerId.value = event.pointerId
    dragStartY.value = event.clientY
    dragStartContentY.value = dragOffset.value
    contentHeight.value = getContentHeight()
  }

  watch(
    contentRef,
    (nextEl, prevEl) => {
      if (prevEl) {
        detachContentListeners(prevEl)
      }

      if (nextEl) {
        attachContentListeners(nextEl)
      }

      currentContentEl = nextEl
    },
    { immediate: true }
  )

  watch(isOpen, (open) => {
    if (open) return

    clearResetTimeout()
    dragOffset.value = 0
    resetDragState()
  })

  onUnmounted(() => {
    clearResetTimeout()
    resetDragState()

    if (currentContentEl) {
      detachContentListeners(currentContentEl)
      currentContentEl = null
    }
  })

  return {
    dragOffset,
    isDragging,
    startDrag
  }
}


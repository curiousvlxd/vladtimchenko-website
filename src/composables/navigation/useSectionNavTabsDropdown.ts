import { SECTION_NAV_TABS } from '~/constants/navigation/section-nav-tabs'

export function useSectionNavTabsDropdown(
  containerRef: Ref<HTMLElement | null>,
  layout: Ref<string>
) {
  const useDropdownByBreakpoint = ref(false)
  const useDropdownByOverflow = ref(false)
  const isClient = ref(false)

  let resizeObserver: ResizeObserver | null = null
  let checkTimeout: ReturnType<typeof setTimeout> | null = null
  let initialCheckTimeout: ReturnType<typeof setTimeout> | null = null

  function getTabsRow(container: HTMLElement): HTMLElement | null {
    const row = container.firstElementChild

    return row instanceof HTMLElement ? row : null
  }

  function getOverflowProbeTarget(tab: HTMLElement): HTMLElement {
    const child = tab.firstElementChild

    return child instanceof HTMLElement ? child : tab
  }

  function checkIfTextOverflows(): boolean {
    if (import.meta.server) return false

    const container = containerRef.value

    if (!container) return false

    const row = getTabsRow(container)

    if (!row) return false

    const tabs = Array.from(row.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    )

    if (tabs.length === 0) return false

    return tabs.some((tab) => {
      const label = getOverflowProbeTarget(tab)

      return label.scrollWidth > label.clientWidth
    })
  }

  function clearCheckTimeout() {
    if (!checkTimeout) return

    clearTimeout(checkTimeout)
    checkTimeout = null
  }

  function clearInitialCheckTimeout() {
    if (!initialCheckTimeout) return

    clearTimeout(initialCheckTimeout)
    initialCheckTimeout = null
  }

  function disconnectResizeObserver() {
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  function connectResizeObserver() {
    disconnectResizeObserver()

    if (
      !import.meta.client ||
      typeof ResizeObserver === 'undefined' ||
      layout.value !== 'horizontal' ||
      useDropdownByBreakpoint.value
    ) {
      return
    }

    const container = containerRef.value

    if (!container) return

    resizeObserver = new ResizeObserver(() => {
      checkOverflow()
    })

    resizeObserver.observe(container)
  }

  function checkOverflow() {
    clearCheckTimeout()

    checkTimeout = setTimeout(() => {
      if (import.meta.client && layout.value === 'horizontal') {
        useDropdownByOverflow.value = checkIfTextOverflows()
      }
    }, SECTION_NAV_TABS.OVERFLOW_CHECK_DEBOUNCE_MS)
  }

  function updateDropdown() {
    if (typeof window === 'undefined') return

    useDropdownByBreakpoint.value =
      window.innerWidth < SECTION_NAV_TABS.DROPDOWN_BREAKPOINT_PX

    if (layout.value !== 'horizontal') {
      useDropdownByOverflow.value = false
      clearCheckTimeout()
      disconnectResizeObserver()
      return
    }

    if (useDropdownByBreakpoint.value) {
      useDropdownByOverflow.value = false
      disconnectResizeObserver()
      return
    }

    connectResizeObserver()
    checkOverflow()
  }

  const shouldUseDropdown = computed(() => {
    if (layout.value !== 'horizontal') return false
    if (!isClient.value) return false

    return useDropdownByBreakpoint.value || useDropdownByOverflow.value
  })

  onMounted(() => {
    isClient.value = true

    if (!import.meta.client) return

    updateDropdown()

    initialCheckTimeout = setTimeout(() => {
      updateDropdown()
    }, SECTION_NAV_TABS.OVERFLOW_CHECK_INITIAL_DELAY_MS)

    window.addEventListener('resize', updateDropdown)
  })

  watch(layout, () => {
    updateDropdown()
  })

  watch(containerRef, () => {
    updateDropdown()
  })

  onUnmounted(() => {
    clearCheckTimeout()
    clearInitialCheckTimeout()
    disconnectResizeObserver()

    if (!import.meta.client) return

    window.removeEventListener('resize', updateDropdown)
  })

  return {
    shouldUseDropdown,
    checkOverflow
  }
}


import { SECTION_NAV } from '~/features/navigation/constants'

export type SectionTab = { id: string; label: string }

export function useSectionNav(tabs: ComputedRef<SectionTab[]>) {
  const tabsList = tabs
  const firstTabId = computed(
    () => tabsList.value[0]?.id ?? SECTION_NAV.DEFAULT_FIRST_SECTION_ID
  )

  const activeSection = ref(
    tabsList.value[0]?.id ?? SECTION_NAV.DEFAULT_FIRST_SECTION_ID
  )
  const scrollTargetId = ref<string | null>(null)

  function getSectionById(id: string): HTMLElement | null {
    if (typeof document === 'undefined') return null

    const section = document.getElementById(id)

    return section instanceof HTMLElement ? section : null
  }

  function getSectionElements(): HTMLElement[] {
    if (typeof document === 'undefined') return []

    return tabsList.value
      .map((tab) => getSectionById(tab.id))
      .filter((section): section is HTMLElement => section !== null)
  }

  function scrollToSection(id: string) {
    activeSection.value = id
    scrollTargetId.value = id

    if (typeof window === 'undefined') return

    const path = window.location.pathname
    const search = window.location.search
    if (typeof history !== 'undefined') {
      const hash = id === firstTabId.value ? '' : `#${id}`
      history.pushState(null, '', `${path}${search}${hash}`)
    }

    let frame = 0
    const performScroll = () => {
      if (frame++ > SECTION_NAV.SCROLL_POLL_MAX_FRAMES) {
        scrollTargetId.value = null
        return
      }
      if (id === firstTabId.value) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { scrollTargetId.value = null }, SECTION_NAV.SCROLL_SETTLE_MS)
        return
      }
      const el = getSectionById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => { scrollTargetId.value = null }, SECTION_NAV.SCROLL_SETTLE_MS)
        return
      }
      requestAnimationFrame(performScroll)
    }
    requestAnimationFrame(performScroll)
  }

  function syncFromHash() {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.slice(1)
    const validIds = new Set(tabsList.value.map((t) => t.id))
    if (hash && validIds.has(hash)) {
      activeSection.value = hash
      nextTick(() => getSectionById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' }))
    } else {
      activeSection.value = firstTabId.value
      window.scrollTo(0, 0)
    }
  }

  function updateActiveSection() {
    if (scrollTargetId.value) return

    const sectionElements = getSectionElements()

    let activeId = firstTabId.value
    let bestDistance = Infinity

    for (const section of sectionElements) {
      const id = section.id
      if (!id) continue

      const top = section.getBoundingClientRect().top
      const distance = Math.abs(top - SECTION_NAV.VIEWPORT_TOP_OFFSET_PX)

      if (distance < bestDistance) {
        bestDistance = distance
        activeId = id
      }
    }
    activeSection.value = activeId
    if (import.meta.client && typeof window !== 'undefined') {
      const path = window.location.pathname
      const search = window.location.search
      const newUrl = path + search + (activeId === firstTabId.value ? '' : '#' + activeId)
      const currentUrl = window.location.pathname + window.location.search + window.location.hash
      if (currentUrl !== newUrl) {
        history.replaceState(null, '', newUrl)
      }
    }
  }

  let observer: IntersectionObserver | null = null
  function onPopState() {
    syncFromHash()
  }

  onMounted(() => {
    if (import.meta.client && typeof window !== 'undefined') {
      syncFromHash()
      window.addEventListener('popstate', onPopState)
    } else {
      activeSection.value = firstTabId.value
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (scrollTargetId.value) {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const id = (e.target as HTMLElement).id
            if (id === scrollTargetId.value && tabsList.value.some((t) => t.id === id)) {
              activeSection.value = id
            }
          }
          return
        }
        updateActiveSection()
      },
      { rootMargin: SECTION_NAV.INTERSECTION_ROOT_MARGIN, threshold: SECTION_NAV.INTERSECTION_THRESHOLD }
    )
    nextTick(() => {
      getSectionElements().forEach((section) => observer?.observe(section))
    })
    if (import.meta.client) {
      window.addEventListener('scroll', updateActiveSection, { passive: true })
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (import.meta.client) {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('popstate', onPopState)
    }
  })

  return {
    tabs: tabsList,
    firstTabId,
    activeSection,
    scrollToSection
  }
}


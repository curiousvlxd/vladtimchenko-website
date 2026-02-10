export type SectionTab = { id: string; label: string }

const VIEWPORT_TOP_OFFSET = 140

export function useSectionNav(tabs: ComputedRef<SectionTab[]>) {
  const tabsList = tabs
  const firstTabId = computed(() => tabsList.value[0]?.id ?? 'about')
  const activeSection = ref(tabsList.value[0]?.id ?? 'about')
  const scrollTargetId = ref<string | null>(null)

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
    const maxFrames = 30
    const performScroll = () => {
      if (frame++ > maxFrames) {
        scrollTargetId.value = null
        return
      }
      if (id === firstTabId.value) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { scrollTargetId.value = null }, 1200)
        return
      }
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => { scrollTargetId.value = null }, 1200)
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
      nextTick(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' }))
    } else {
      activeSection.value = firstTabId.value
      window.scrollTo(0, 0)
    }
  }

  function updateActiveSection() {
    if (scrollTargetId.value) return
    const sectionEls = document.querySelectorAll<HTMLElement>('[data-section]')
    const tabIds = new Set(tabsList.value.map((t) => t.id))
    let activeId = firstTabId.value
    let bestDistance = Infinity
    for (const el of sectionEls) {
      const id = el.getAttribute('data-section')
      if (!id || !tabIds.has(id)) continue
      const top = el.getBoundingClientRect().top
      const distance = Math.abs(top - VIEWPORT_TOP_OFFSET)
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
            const id = (e.target as HTMLElement).getAttribute('data-section')
            if (id === scrollTargetId.value && tabsList.value.some((t) => t.id === id)) {
              activeSection.value = id
            }
          }
          return
        }
        updateActiveSection()
      },
      { rootMargin: '0px 0px -50% 0px', threshold: 0 }
    )
    nextTick(() => {
      document.querySelectorAll('[data-section]').forEach((el) => {
        observer?.observe(el)
      })
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

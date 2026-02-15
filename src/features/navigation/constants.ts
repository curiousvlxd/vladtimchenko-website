export const CLOSE_ON_DRAG_RATIO = 0.6
export const SNAP_BACK_RATIO = 0.4
export const SNAP_BACK_DURATION_MS = 300
export const MAX_HEIGHT_VH = 80

export const BOTTOM_SHEET_RULES = {
  CLOSE_ON_DRAG_RATIO,
  SNAP_BACK_RATIO,
  SNAP_BACK_DURATION_MS,
  MAX_HEIGHT_VH
} as const

export const BOTTOM_SHEET = BOTTOM_SHEET_RULES

export interface NavItem {
  to: string
  label: string
  exact?: boolean
}

export const PAGES = [
  { to: '/', label: 'Home', exact: true, nav: true },
  { to: '/feed', label: 'Feed', exact: false, nav: true },
  { to: '/cv', label: 'CV', exact: true, nav: true }
] as const

export const NAV_LINKS: readonly NavItem[] = PAGES.filter((p) => p.nav).map(({ to, label, exact }) => ({
  to,
  label,
  ...(exact && { exact })
}))

export const SITEMAP_PATHS = ['/', '/cv', '/feed'] as const

export const DROPDOWN_BREAKPOINT_PX = 480
export const OVERFLOW_CHECK_DEBOUNCE_MS = 200
export const OVERFLOW_CHECK_INITIAL_DELAY_MS = 500

export const SECTION_NAV_TABS = {
  DROPDOWN_BREAKPOINT_PX,
  OVERFLOW_CHECK_DEBOUNCE_MS,
  OVERFLOW_CHECK_INITIAL_DELAY_MS
} as const

export const SECTION_NAV = {
  DEFAULT_FIRST_SECTION_ID: 'about',
  VIEWPORT_TOP_OFFSET_PX: 140,
  SCROLL_POLL_MAX_FRAMES: 30,
  SCROLL_SETTLE_MS: 1200,
  INTERSECTION_ROOT_MARGIN: '0px 0px -50% 0px',
  INTERSECTION_THRESHOLD: 0
} as const

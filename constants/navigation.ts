export interface NavItem {
  to: string
  label: string
  exact?: boolean
}

export const PAGES = [
  { to: '/', label: 'Home', exact: true, nav: true },
  { to: '/about', label: 'About', nav: false },
  { to: '/projects', label: 'Projects', nav: false },
  { to: '/feed', label: 'Feed', nav: true },
  { to: '/cv', label: 'CV', exact: true, nav: false }
] as const

export const NAV_LINKS: readonly NavItem[] = PAGES.filter((p) => p.nav).map(({ to, label, exact }) => ({
  to,
  label,
  ...(exact && { exact })
}))

export const STATIC_PATHS = PAGES.map((p) => p.to === '/' ? '' : p.to) as readonly string[]

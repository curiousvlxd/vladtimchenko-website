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

import { resolve } from 'node:path'
import { PUBLIC_ASSETS } from './src/constants/public-assets'

const DEFAULT_GITHUB_SITE_REPO = 'curiousvlxd/vladtimchenko-website'

export default defineNuxtConfig({
  compatibilityDate: '2025-02-07',
  srcDir: 'src/',
  dir: {
    public: resolve(process.cwd(), 'public')
  },
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@vueuse/motion/nuxt'],

  nitro: {
    preset: 'cloudflare_pages',
    output: { dir: 'dist' },
    prerender: {
      autoSubfolderIndex: false
    },
    routeRules: {
      '/giscus-theme.css': {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    }
  },

  spaLoadingTemplate: false,

  content: {
    sources: {
      feed: {
        driver: 'fs',
        prefix: '/feed',
        base: resolve(process.cwd(), 'src/data/feed')
      }
    },
    highlight: {
      theme: 'github-dark',
      preload: ['ts', 'vue', 'md', 'mdx', 'json']
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', style: 'background-color: #05090E' },
      bodyAttrs: { style: 'background-color: #05090E' },
      title: 'Vlad Timchenko · Software Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Vlad Timchenko • Software Engineer • Cloud-native .NET' },
        { name: 'keywords', content: 'Vlad Timchenko, Vladyslav Timchenko, Software Engineer, .NET, backend' },
        { name: 'msapplication-TileColor', content: '#05090E' },
        { name: 'msapplication-TileImage', content: PUBLIC_ASSETS.MSTILE },
        { name: 'theme-color', content: '#05090E' }
      ],
      link: [
        { rel: 'icon', href: PUBLIC_ASSETS.FAVICON, sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: PUBLIC_ASSETS.LOGO },
        { rel: 'icon', type: 'image/png', href: PUBLIC_ASSETS.FAVICON_32, sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: PUBLIC_ASSETS.FAVICON_16, sizes: '16x16' },
        { rel: 'apple-touch-icon', href: PUBLIC_ASSETS.APPLE_TOUCH, sizes: '180x180' },
        { rel: 'manifest', href: PUBLIC_ASSETS.MANIFEST },
        { rel: 'mask-icon', href: PUBLIC_ASSETS.MASK_ICON, color: '#18B7A4' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' },
        { rel: 'prefetch', href: '/feed' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap' },
      ]
    },
    pageTransition: false
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    githubSiteRepo: process.env.GITHUB_SITE_REPO ?? DEFAULT_GITHUB_SITE_REPO,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://vladtimchenko.dev',
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      formspreeFormId: process.env.NUXT_PUBLIC_FORMSPREE_FORM_ID ?? '',
      giscusRepo: process.env.GISCUS_REPO ?? 'curiousvlxd/vladtimchenko-website',
      giscusRepoId: process.env.GISCUS_REPO_ID ?? 'R_kgDORK_eZw',
      giscusCategory: process.env.GISCUS_CATEGORY ?? 'Announcements',
      giscusCategoryId: process.env.GISCUS_CATEGORY_ID ?? 'DIC_kwDORK_eZ84C2ECR',
      giscusThemePath: process.env.GISCUS_THEME_PATH ?? PUBLIC_ASSETS.GISCUS_THEME
    }
  }
})

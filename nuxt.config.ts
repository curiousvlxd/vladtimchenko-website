import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2025-02-07',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss', '@vueuse/motion/nuxt'],
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  spaLoadingTemplate: false,
  content: {
    sources: {
      feed: {
        driver: 'fs',
        prefix: '/blog',
        base: resolve(process.cwd(), 'data/feed')
      }
    },
    highlight: {
      theme: 'github-dark',
      preload: ['ts', 'vue', 'md', 'mdx', 'json']
    }
  },
  app: {
    head: {
      htmlAttrs: { style: 'background-color: #05090E' },
      bodyAttrs: { style: 'background-color: #05090E' },
      title: 'Vlad Timchenko - Software Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Software Engineer • Cloud-native .NET' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'prefetch', href: '/blog' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap' },
        { rel: 'preload', href: '/logo.svg', as: 'image' },
        { rel: 'preload', href: '/me.jpg', as: 'image' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://vladtimchenko.dev',
      giscusRepo: '',
      giscusRepoId: '',
      giscusCategory: '',
      giscusCategoryId: ''
    }
  }
})

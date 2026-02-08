<template>
  <a
    href="/"
    class="logo-link inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-lg transition-opacity duration-200 hover:opacity-100 hover:brightness-125"
    :class="size === 'large' ? 'shrink-0 w-16 sm:w-56 md:w-72' : 'min-w-0 max-w-[45vw] sm:max-w-none'"
    :style="linkStyle"
    @click="onLogoClick"
  >
    <img
      v-if="variant === 'white'"
      :src="ASSETS.LOGO_WHITE"
      :alt="alt"
      :class="sizeClass"
      width="280"
      height="80"
      :style="imgStyle"
    />
    <img
      v-else
      :src="ASSETS.LOGO"
      :alt="alt"
      :class="sizeClass"
      width="280"
      height="80"
      :style="imgStyle"
    />
  </a>
</template>

<script setup lang="ts">
import { ASSETS } from '~/constants'

const route = useRoute()

function onLogoClick(e: MouseEvent) {
  if (route.path === '/' && !e.ctrlKey && !e.metaKey && e.button === 0) {
    e.preventDefault()
    window.location.reload()
  }
}

const props = withDefaults(
  defineProps<{
    variant?: 'white' | 'default'
    size?: 'default' | 'large'
    alt?: string
  }>(),
  { variant: 'white', size: 'default', alt: 'Vlad Timchenko' }
)
const sizeClass = computed(() =>
  props.size === 'large' ? 'h-6 sm:h-16 md:h-20 w-auto' : 'h-8 w-auto'
)
const linkStyle = computed(() => {
  if (props.size !== 'large') return { maxWidth: '240px' }
  return {}
})
const imgStyle = computed(() => ({
  maxWidth: '100%',
  maxHeight: props.size === 'large' ? '5rem' : '4rem',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  display: 'block'
}))
</script>

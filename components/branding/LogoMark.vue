<template>
  <NuxtLink
      to="/"
      class="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
      :class="size === 'large' ? 'shrink-0 w-28 sm:w-56 md:w-72' : 'min-w-0 max-w-[45vw] sm:max-w-none'"
      :style="linkStyle"
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
  </NuxtLink>
</template>

<script setup lang="ts">
import { ASSETS } from '~/constants'

const props = withDefaults(
  defineProps<{
    variant?: 'white' | 'default'
    size?: 'default' | 'large'
    alt?: string
  }>(),
  { variant: 'white', size: 'default', alt: 'Vlad Timchenko' }
)
const sizeClass = computed(() =>
  props.size === 'large' ? 'h-10 sm:h-16 md:h-20 w-auto' : 'h-8 w-auto'
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

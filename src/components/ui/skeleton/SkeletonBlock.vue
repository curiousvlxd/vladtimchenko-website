<template>
  <div
    :class="blockClasses"
    :style="blockStyle"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    className?: string
    width?: string
    height?: string
    roundedClass?: string
    tone?: 'soft' | 'strong' | 'card'
    animated?: boolean
  }>(),
  {
    className: '',
    width: '',
    height: '',
    roundedClass: 'rounded',
    tone: 'soft',
    animated: true
  }
)

const toneClass = computed(() => {
  if (props.tone === 'strong') return 'bg-teal/20'
  if (props.tone === 'card') return 'bg-bg-card border border-teal/20'
  return 'bg-teal/10'
})

const blockClasses = computed(() => [
  toneClass.value,
  props.roundedClass,
  props.animated ? 'animate-pulse' : '',
  props.className
])

const blockStyle = computed(() => ({
  width: props.width || undefined,
  height: props.height || undefined
}))
</script>

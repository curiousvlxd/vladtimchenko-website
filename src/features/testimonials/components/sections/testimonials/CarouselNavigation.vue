<template>
  <div class="w-full flex items-center gap-3">
    <button
      v-if="showArrows"
      @click="$emit('previous')"
      class="shrink-0 w-11 h-11 rounded-full bg-bg-card/95 border border-teal/30 text-teal flex items-center justify-center cursor-pointer transition-all duration-200 z-40 backdrop-blur-sm shadow-lg hover:bg-teal/15 hover:border-teal/50 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed -order-1 hidden sm:flex"
      :disabled="isFirst"
      aria-label="Previous testimonial"
    >
      <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div 
      ref="containerRef"
      class="carousel-viewport relative overflow-hidden flex-1 min-w-0 w-full py-0.5 px-2"
      @mouseenter="$emit('mouse-enter')"
      @mouseleave="$emit('mouse-leave')"
      @mousemove="$emit('mouse-move', $event)"
    >
      <div
        ref="carouselRef"
        class="testimonials-carousel flex"
        :style="carouselStyle"
        @touchstart="$emit('touch-start', $event)"
        @touchmove="$emit('touch-move', $event)"
        @touchend="$emit('touch-end', $event)"
      >
        <slot />
      </div>
    </div>

    <button
      v-if="showArrows"
      @click="$emit('next')"
      class="shrink-0 w-11 h-11 rounded-full bg-bg-card/95 border border-teal/30 text-teal flex items-center justify-center cursor-pointer transition-all duration-200 z-40 backdrop-blur-sm shadow-lg hover:bg-teal/15 hover:border-teal/50 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed order-1 hidden sm:flex"
      :disabled="isLast"
      aria-label="Next testimonial"
    >
      <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { TESTIMONIAL_CONSTANTS } from '~/features/testimonials/constants'

const props = defineProps<{
  showArrows: boolean
  isFirst: boolean
  isLast: boolean
  currentIndex: number
  slideWidth: number
}>()

const carouselStyle = computed(() => ({
  transform: `translate3d(-${props.currentIndex * props.slideWidth}%, 0, 0) translateZ(0)`,
  '--carousel-duration': `${TESTIMONIAL_CONSTANTS.CAROUSEL_TRANSITION_DURATION_MS}ms`,
  '--carousel-easing': TESTIMONIAL_CONSTANTS.CAROUSEL_TRANSITION_EASING
}))

defineEmits<{
  previous: []
  next: []
  'mouse-enter': []
  'mouse-leave': []
  'mouse-move': [event: MouseEvent]
  'touch-start': [event: TouchEvent]
  'touch-move': [event: TouchEvent]
  'touch-end': [event: TouchEvent]
}>()

const containerRef = ref<HTMLElement | null>(null)
const carouselRef = ref<HTMLElement | null>(null)

defineExpose({
  get containerRef() {
    return containerRef
  },
  get carouselRef() {
    return carouselRef
  }
})
</script>

<style scoped>
.carousel-viewport {
  overflow: hidden;
  isolation: isolate;
}

.testimonials-carousel {
  width: 100%;
  flex-shrink: 0;
  backface-visibility: hidden;
  transition: transform var(--carousel-duration, 0.45s) var(--carousel-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94));
}
</style>


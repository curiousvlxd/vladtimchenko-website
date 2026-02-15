<template>
  <section
    id="testimonials"
    data-section="testimonials"
    class="mb-12 scroll-mt-24 sm:scroll-mt-28"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-6">
      {{ title }}
    </h2>
    <p v-if="description" class="text-muted-light text-sm mb-6">
      {{ description }}
    </p>

    <CarouselNavigation
        ref="navigationRef"
        :show-arrows="testimonials.length > cardsPerView && !isMobile"
        :is-first="currentIndex === 0"
        :is-last="currentIndex >= maxIndex"
        :current-index="currentIndex"
        :slide-width="slideWidth"
        @previous="handlePrevious"
        @next="handleNext"
        @mouse-enter="handleMouseEnter"
        @mouse-leave="handleMouseLeave"
        @mouse-move="handleMouseMove"
        @touch-start="handleTouchStart"
        @touch-move="handleTouchMove"
        @touch-end="handleTouchEnd"
      >
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="testimonial-card-wrapper"
          :style="{ width: `${slideWidth}%` }"
        >
          <TestimonialCard
            :testimonial="testimonial"
            @click="handleCardClick"
          />
        </div>
    </CarouselNavigation>

    <CarouselPagination
      :total-slides="totalSlides"
      :active-slide-index="Math.floor(currentIndex / cardsPerView)"
      @go-to-slide="handleGoToSlide"
    />

    <TestimonialModal
      :testimonial="modalTestimonial"
      @close="closeModal"
    />
  </section>
</template>

<script setup lang="ts">
import { TESTIMONIAL_CONSTANTS } from '~/features/testimonials/constants'
import { testimonials } from '~/data/testimonials'
import { useResponsive } from '~/features/testimonials/composables/useResponsive'
import { useCarousel } from '~/features/testimonials/composables/useCarousel'
import { useSwipe } from '~/features/testimonials/composables/useSwipe'
import { useHoverScroll } from '~/features/testimonials/composables/useHoverScroll'
import { useTestimonialModal } from '~/features/testimonials/composables/useTestimonialModal'
import { useAutoplay } from '~/features/testimonials/composables/useAutoplay'
import CarouselNavigation from './CarouselNavigation.vue'
import CarouselPagination from './CarouselPagination.vue'
import TestimonialCard from './TestimonialCard.vue'
import TestimonialModal from './TestimonialModal.vue'

defineProps<{
  title?: string
  description?: string
}>()

const { isMobile } = useResponsive()
const testimonialsRef = ref(testimonials)

const cardsPerView = computed(() =>
  isMobile.value
    ? TESTIMONIAL_CONSTANTS.CARDS_PER_VIEW.MOBILE
    : TESTIMONIAL_CONSTANTS.CARDS_PER_VIEW.DESKTOP
)

const {
  currentIndex,
  slideWidth,
  totalSlides,
  maxIndex,
  next,
  previous,
  goToSlide,
  resetIndex
} = useCarousel(testimonialsRef, cardsPerView)

const { modalTestimonial, openModal, closeModal } = useTestimonialModal()

const navigationRef = ref<InstanceType<typeof CarouselNavigation> | null>(null)
const containerRef = computed<HTMLElement | null>(() => {
  const nav = navigationRef.value
  if (!nav) return null
  const exposed = nav as unknown as { containerRef?: Ref<HTMLElement | null> }
  return exposed.containerRef?.value ?? null
})

const { startAutoplay } = useAutoplay(() => {
  next()
  startAutoplay()
})

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
  () => next(),
  () => previous()
)

const { handleMouseEnter, handleMouseLeave, handleMouseMove } = useHoverScroll(
  containerRef,
  isMobile,
  currentIndex,
  maxIndex,
  () => {
    previous()
    startAutoplay()
  },
  () => {
    next()
    startAutoplay()
  }
)

function handlePrevious() {
  previous()
  startAutoplay()
}

function handleNext() {
  next()
  startAutoplay()
}

function handleGoToSlide(index: number) {
  goToSlide(index)
  startAutoplay()
}

function handleCardClick(testimonial: (typeof testimonials)[0]) {
  openModal(testimonial)
}

watch(isMobile, () => {
  resetIndex()
})

onMounted(() => {
  if (import.meta.client) {
    startAutoplay()
  }
})
</script>

<style scoped>
.testimonial-card-wrapper {
  flex-shrink: 0;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
}

@media (min-width: 1024px) {
  .testimonial-card-wrapper {
    padding: 0 16px;
  }
}

@media (max-width: 640px) {
  .testimonial-card-wrapper {
    padding: 0 4px;
  }
}
</style>


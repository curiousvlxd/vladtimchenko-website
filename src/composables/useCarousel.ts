import { TESTIMONIAL_CONSTANTS } from '../constants/testimonials'

export function useCarousel(items: Ref<unknown[]>, cardsPerView: ComputedRef<number>) {
  const currentIndex = ref(0)

  const slideWidth = computed(() => 100 / cardsPerView.value)
  const totalSlides = computed(() => Math.ceil(items.value.length / cardsPerView.value))
  const maxIndex = computed(() => Math.max(0, items.value.length - cardsPerView.value))

  function next() {
    if (currentIndex.value < maxIndex.value) {
      currentIndex.value = Math.min(currentIndex.value + cardsPerView.value, maxIndex.value)
    } else {
      currentIndex.value = 0
    }
  }

  function previous() {
    if (currentIndex.value > 0) {
      currentIndex.value = Math.max(currentIndex.value - cardsPerView.value, 0)
    } else {
      currentIndex.value = maxIndex.value
    }
  }

  function goToSlide(slideIndex: number) {
    currentIndex.value = slideIndex * cardsPerView.value
  }

  function resetIndex() {
    if (currentIndex.value > maxIndex.value) {
      currentIndex.value = maxIndex.value
    }
  }

  return {
    currentIndex,
    slideWidth,
    totalSlides,
    maxIndex,
    next,
    previous,
    goToSlide,
    resetIndex
  }
}

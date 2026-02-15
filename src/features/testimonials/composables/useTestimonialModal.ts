import type { Testimonial } from '~/data/testimonials'
import { useBodyScrollLock } from '~/common/composables/core/useBodyScrollLock'

export function useTestimonialModal() {
  const modalTestimonial = ref<Testimonial | null>(null)
  const isOpen = computed(() => modalTestimonial.value !== null)

  useBodyScrollLock(isOpen)

  function openModal(testimonial: Testimonial) {
    modalTestimonial.value = testimonial
  }

  function closeModal() {
    modalTestimonial.value = null
  }

  return {
    modalTestimonial: readonly(modalTestimonial),
    openModal,
    closeModal
  }
}

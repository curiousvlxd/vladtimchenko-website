import type { Testimonial } from '../data/testimonials'

export function useTestimonialModal() {
  const modalTestimonial = ref<Testimonial | null>(null)

  function openModal(testimonial: Testimonial) {
    modalTestimonial.value = testimonial
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  }

  function closeModal() {
    modalTestimonial.value = null
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  }

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  })

  return {
    modalTestimonial: readonly(modalTestimonial),
    openModal,
    closeModal
  }
}

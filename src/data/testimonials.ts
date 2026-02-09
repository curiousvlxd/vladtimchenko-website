import testimonialsData from './content/testimonials.json'

export interface Testimonial {
  id: string
  text: string
  author: string
  position: string
  company?: string
  date: string
  linkedinUrl?: string
}

export const testimonials: Testimonial[] = testimonialsData as Testimonial[]

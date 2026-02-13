import testimonialsData from './content/testimonials.json'

export type TestimonialSource = 'linkedin'

export interface Testimonial {
  id: string
  text: string
  author: string
  source: TestimonialSource
  company?: string
  date: string
  position: string
  linkedinUrl?: string
}

type RawTestimonial = {
  id: string
  text: string
  author: string
  position?: string
  company?: string
  date: string
  linkedinUrl?: string
}

function normalizeTestimonial(raw: RawTestimonial): Testimonial {
  return {
    id: raw.id,
    text: raw.text,
    author: raw.author,
    position: raw.position ?? '',
    company: raw.company,
    date: raw.date,
    source: 'linkedin',
    linkedinUrl: raw.linkedinUrl
  }
}

export const testimonials: Testimonial[] = (testimonialsData as RawTestimonial[]).map(normalizeTestimonial)

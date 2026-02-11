export const FORMSPREE_ENDPOINT_BASE_URL = 'https://formspree.io/f'
export const DEFAULT_EMAIL_DOMAIN = '@gmail.com'
export const EMAIL_VALIDATION_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
export const MESSAGE_TEXTAREA_MIN_HEIGHT_PX = 112
export const MESSAGE_TEXTAREA_MAX_HEIGHT_PX = 176
export const CONTACT_FORM_ACTIONS_GAP_PX = 24
export const CONTACT_TURNSTILE_SLOT_MIN_HEIGHT_PX = 65

export function buildFormspreeEndpoint(formId: string): string {
  return `${FORMSPREE_ENDPOINT_BASE_URL}/${formId.trim()}`
}

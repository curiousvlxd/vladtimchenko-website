export function useContactForm() {
  const formRef = ref<HTMLFormElement | null>(null)
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const submitting = ref(false)
  const errors = ref<{ name?: string; email?: string; message?: string }>({})

  const modalOpen = ref(false)
  const modalVariant = ref<'success' | 'error'>('success')
  const modalTitle = ref('')
  const modalMessage = ref('')

  const emailMeasureRef = ref<HTMLElement | null>(null)
  const emailMeasureWidth = ref(0)
  const showEmailSuggestion = computed(
    () => email.value.length > 0 && !email.value.includes('@')
  )

  function updateEmailMeasureWidth() {
    nextTick(() => {
      if (emailMeasureRef.value) {
        emailMeasureWidth.value = emailMeasureRef.value.offsetWidth
      }
    })
  }
  watch(email, updateEmailMeasureWidth)

  function applyEmailSuggestion() {
    if (!email.value.includes('@')) {
      email.value = email.value + '@gmail.com'
    }
  }

  function onEmailTab() {
    if (showEmailSuggestion.value) {
      applyEmailSuggestion()
    }
  }

  function normalizeEmail() {
    if (!email.value) return
    if (email.value.includes('@')) return
    email.value = `${email.value}@gmail.com`
  }

  function validate(): boolean {
    const next: { name?: string; email?: string; message?: string } = {}

    if (!name.value.trim()) {
      next.name = 'Please enter your name.'
    }

    const e = email.value.trim()
    if (!e) {
      next.email = 'Please enter your email.'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      next.email = 'Please enter a valid email address.'
    }

    if (!message.value.trim()) {
      next.message = 'Please enter a message.'
    }

    errors.value = next
    return Object.keys(next).length === 0
  }

  function openModal(variant: 'success' | 'error', title: string, text: string) {
    modalVariant.value = variant
    modalTitle.value = title
    modalMessage.value = text
    modalOpen.value = true
  }

  async function submit(turnstileToken?: string | null) {
    if (!validate()) return

    const config = useRuntimeConfig().public
    const formId = (config.formspreeFormId as string)?.trim()
    if (!formId) {
      openModal('error', 'Submission failed', 'Contact form is not configured.')
      return
    }

    submitting.value = true
    try {
      const body: Record<string, string> = {
        name: name.value,
        email: email.value,
        message: message.value
      }
      if (turnstileToken) {
        body['cf-turnstile-response'] = turnstileToken
      }

      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      let data: any = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (response.ok) {
        openModal(
          'success',
          'Message sent',
          "Thanks for reaching out. I'll get back to you soon."
        )
        name.value = ''
        email.value = ''
        message.value = ''
        errors.value = {}
        updateEmailMeasureWidth()
        if (formRef.value) {
          formRef.value.reset()
        }
      } else {
        const serverMessage =
          data?.error || (data?.errors?.length ? data.errors.map((e: any) => e.message).join(' ') : null) || 'Something went wrong. Please try again later.'
        openModal('error', 'Submission failed', serverMessage)
      }
    } catch {
      openModal(
        'error',
        'Network error',
        'There was a problem sending your message. Please try again in a moment.'
      )
    } finally {
      submitting.value = false
    }
  }

  return {
    formRef,
    name,
    email,
    message,
    submitting,
    errors,
    modalOpen,
    modalVariant,
    modalTitle,
    modalMessage,
    emailMeasureRef,
    emailMeasureWidth,
    showEmailSuggestion,
    updateEmailMeasureWidth,
    applyEmailSuggestion,
    onEmailTab,
    normalizeEmail,
    submit
  }
}

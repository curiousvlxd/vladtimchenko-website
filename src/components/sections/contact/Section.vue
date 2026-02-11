<template>
  <section
    id="contact"
    data-section="contact"
    class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)]"
  >
    <h2 class="font-display text-2xl font-semibold text-muted-pale mb-4">
      {{ title }}
    </h2>

    <p class="text-sm text-muted-light mb-6">
      {{ description }}
    </p>

    <form
      ref="contactFormRef"
      :action="contactFormAction"
      method="POST"
      class="mt-2 space-y-4 sm:mt-3"
      @submit.prevent="handleContactSubmit"
    >
      <div class="space-y-1.5">
        <label for="name" class="block text-sm font-medium text-muted-light">
          {{ HOME_SECTION_COPY.CONTACT.NAME_LABEL }}
        </label>
        <input
          id="name"
          v-model="contactName"
          name="name"
          type="text"
          autocomplete="name"
          class="block w-full rounded-xl px-3 py-2 text-sm text-muted-pale placeholder:text-muted/70 transition-colors bg-bg-card border border-white/10 focus:outline-none"
          :class="contactErrors.name ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:border-teal focus:ring-1 focus:ring-teal'"
          :placeholder="HOME_SECTION_COPY.CONTACT.NAME_PLACEHOLDER"
        />
        <p v-if="contactErrors.name" class="mt-1 text-xs text-red-400">
          {{ contactErrors.name }}
        </p>
      </div>

      <div class="space-y-1.5">
        <label for="email" class="block text-sm font-medium text-muted-light">
          {{ HOME_SECTION_COPY.CONTACT.EMAIL_LABEL }}
        </label>
        <div class="relative">
          <span
            ref="emailMeasureRef"
            class="absolute left-0 top-0 invisible whitespace-pre text-sm font-sans"
            aria-hidden="true"
          >{{ contactEmail }}</span>

          <div
            v-if="showEmailSuggestion"
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-sans"
            style="padding-top: 0.5rem; padding-bottom: 0.5rem;"
          >
            <span :style="{ width: `${emailMeasureWidth}px`, minWidth: 0 }" class="shrink-0" />
            <span
              class="shrink-0 text-muted cursor-pointer select-none pointer-events-auto hover:text-muted-light"
              @click="applyEmailSuggestion"
            >
              {{ HOME_SECTION_COPY.CONTACT.EMAIL_SUGGESTION_DOMAIN }}
            </span>
          </div>

          <input
            id="email"
            v-model="contactEmail"
            name="_replyto"
            type="email"
            autocomplete="email"
            class="block w-full rounded-xl px-3 py-2 text-sm text-muted-pale placeholder:text-muted/70 transition-colors bg-bg-card border border-white/10 focus:outline-none"
            :class="contactErrors.email ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:border-teal focus:ring-1 focus:ring-teal'"
            :placeholder="HOME_SECTION_COPY.CONTACT.EMAIL_PLACEHOLDER"
            @blur="normalizeContactEmail"
            @keydown.tab="onEmailTab"
          />
        </div>
        <p v-if="contactErrors.email" class="mt-1 text-xs text-red-400">
          {{ contactErrors.email }}
        </p>
      </div>

      <div class="space-y-1.5">
        <label for="message" class="block text-sm font-medium text-muted-light">
          {{ HOME_SECTION_COPY.CONTACT.MESSAGE_LABEL }}
        </label>
        <textarea
          id="message"
          ref="messageTextareaRef"
          v-model="contactMessage"
          name="message"
          rows="4"
          class="contact-message-textarea block w-full rounded-xl px-3 py-2 text-sm text-muted-pale placeholder:text-muted/70 transition-colors bg-bg-card border border-white/10 focus:outline-none resize-none overflow-y-auto"
          :class="contactErrors.message ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:border-teal focus:ring-1 focus:ring-teal'"
          :placeholder="HOME_SECTION_COPY.CONTACT.MESSAGE_PLACEHOLDER"
          :style="messageTextareaStyle"
          @input="adjustTextareaHeight"
        />
        <p v-if="contactErrors.message" class="mt-1 text-xs text-red-400">
          {{ contactErrors.message }}
        </p>
      </div>

      <input type="text" name="_gotcha" hidden>

      <div class="contact-form-actions flex flex-col items-start pt-2 sm:pt-4" :style="contactActionsStyle">
        <div class="contact-turnstile-slot w-full" :style="turnstileSlotStyle">
          <ContactTurnstileWidget ref="contactTurnstileRef" />
        </div>

        <button
          type="submit"
          :disabled="contactSubmitting"
          class="inline-flex items-center justify-center rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-bg hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors disabled:opacity-60"
        >
          <span v-if="contactSubmitting">
            {{ HOME_SECTION_COPY.CONTACT.SENDING_LABEL }}
          </span>
          <span v-else>
            {{ HOME_SECTION_COPY.CONTACT.SEND_LABEL }}
          </span>
        </button>
      </div>
    </form>
  </section>

  <StatusModal
    v-model="contactModalOpen"
    :variant="contactModalVariant"
    :title="contactModalTitle"
    :message="contactModalMessage"
    :aria-label="HOME_SECTION_COPY.CONTACT.STATUS_MODAL_LABEL"
  />
</template>

<script setup lang="ts">
import StatusModal from '~/components/modals/status/StatusModal.vue'
import ContactTurnstileWidget from '~/components/sections/contact/TurnstileWidget.client.vue'
import {
  buildFormspreeEndpoint,
  CONTACT_FORM_ACTIONS_GAP_PX,
  CONTACT_TURNSTILE_SLOT_MIN_HEIGHT_PX,
  MESSAGE_TEXTAREA_MIN_HEIGHT_PX,
  MESSAGE_TEXTAREA_MAX_HEIGHT_PX
} from '~/constants/contact/contact-form'
import { HOME_SECTION_COPY } from '~/constants/home/home-sections'
import { useContactForm } from '~/composables/contact/useContactForm'
import { useTextareaAutoResize } from '~/composables/ui/useTextareaAutoResize'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: HOME_SECTION_COPY.CONTACT.TITLE,
    description: HOME_SECTION_COPY.CONTACT.DESCRIPTION
  }
)

const {
  formRef: contactFormRef,
  name: contactName,
  email: contactEmail,
  message: contactMessage,
  submitting: contactSubmitting,
  errors: contactErrors,
  modalOpen: contactModalOpen,
  modalVariant: contactModalVariant,
  modalTitle: contactModalTitle,
  modalMessage: contactModalMessage,
  emailMeasureRef,
  emailMeasureWidth,
  showEmailSuggestion,
  applyEmailSuggestion,
  onEmailTab,
  normalizeEmail: normalizeContactEmail,
  submit: onContactSubmit
} = useContactForm()

const contactTurnstileRef = ref<InstanceType<typeof ContactTurnstileWidget> | null>(null)

const {
  textareaRef: messageTextareaRef,
  adjustTextareaHeight
} = useTextareaAutoResize(MESSAGE_TEXTAREA_MAX_HEIGHT_PX, MESSAGE_TEXTAREA_MIN_HEIGHT_PX)
const messageTextareaStyle = computed(() => ({
  minHeight: `${MESSAGE_TEXTAREA_MIN_HEIGHT_PX}px`,
  maxHeight: `${MESSAGE_TEXTAREA_MAX_HEIGHT_PX}px`
}))
const contactActionsStyle = computed(() => ({
  rowGap: `${CONTACT_FORM_ACTIONS_GAP_PX}px`
}))
const turnstileSlotStyle = computed(() => ({
  minHeight: `${CONTACT_TURNSTILE_SLOT_MIN_HEIGHT_PX}px`
}))

const config = useRuntimeConfig().public
const contactFormAction = computed(() => {
  const formId = (config.formspreeFormId as string)?.trim()
  return formId ? buildFormspreeEndpoint(formId) : '#'
})

function handleContactSubmit() {
  const token = unref(contactTurnstileRef.value?.token) ?? null
  onContactSubmit(token)
}

watch([contactModalOpen, contactModalVariant], ([open, variant]) => {
  if (open && variant === 'success') {
    nextTick(() => contactTurnstileRef.value?.reset?.())
  }
})

onMounted(() => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})

watch(contactMessage, () => {
  nextTick(adjustTextareaHeight)
})
</script>

<style scoped>
.contact-message-textarea {
  scrollbar-width: thin;
  scrollbar-color: rgba(24, 183, 164, 0.5) rgba(255, 255, 255, 0.06);
}

.contact-message-textarea::-webkit-scrollbar {
  width: 8px;
}

.contact-message-textarea::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
}

.contact-message-textarea::-webkit-scrollbar-thumb {
  background: rgba(24, 183, 164, 0.5);
  border-radius: 4px;
}

.contact-message-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(24, 183, 164, 0.7);
}
</style>


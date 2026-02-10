<template>
  <main id="home-top" class="min-w-0 flex-1 max-w-4xl">
    <BrandingHeroBannerCard class="mb-8 sm:mb-10" />

    <section
      id="about"
      data-section="about"
      class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 mb-8 scroll-mt-24 sm:scroll-mt-28"
      v-motion="motionFade"
    >
      <h2 class="font-display text-2xl font-semibold text-muted-pale mb-4">
        {{ home?.about?.title ?? 'About' }}
      </h2>
      <div class="prose prose-invert max-w-none">
        <p
          v-for="(p, i) in (home?.about?.paragraphs ?? [])"
          :key="i"
          class="text-muted-light leading-relaxed mb-4 last:mb-0"
        >
          {{ p }}
        </p>
      </div>
    </section>

    <section
      id="experience"
      data-section="experience"
      class="mb-12 scroll-mt-24 sm:scroll-mt-28"
    >
      <h2 class="font-display text-2xl font-semibold text-muted-pale mb-3">
        {{ home?.experience?.title ?? 'Experience' }}
      </h2>
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <div
          class="inline-flex flex-col rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/15 to-teal/5 px-6 py-4 shadow-[0_0_0_1px_rgba(24,183,164,0.08),0_4px_12px_-2px_rgba(0,0,0,0.2)]"
          v-motion="motionItem"
        >
          <span class="font-display text-lg font-semibold tracking-tight text-teal">{{ getTotalExperienceDisplay() }}</span>
        </div>
        <div
          class="inline-flex flex-col rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/15 to-teal/5 px-6 py-4 shadow-[0_0_0_1px_rgba(24,183,164,0.08),0_4px_12px_-2px_rgba(0,0,0,0.2)]"
          v-motion="motionItem"
        >
          <span class="text-xs font-medium uppercase tracking-wider text-teal mb-0.5">Domains</span>
          <span class="text-sm text-muted-light">{{ EXPERIENCE_DOMAINS.join(', ') }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <SectionsExperienceCard
          v-for="entry in experienceEntries"
          :key="entry.company + entry.role"
          :entry="entry"
        />
      </div>
    </section>

    <section
      id="volunteering"
      data-section="volunteering"
      class="mb-12 scroll-mt-24 sm:scroll-mt-28"
    >
      <h2 class="font-display text-2xl font-semibold text-muted-pale mb-6">
        {{ home?.volunteering?.title ?? 'Volunteering' }}
      </h2>
      <div class="flex flex-col gap-6">
        <SectionsVolunteeringCard
          v-for="entry in volunteeringEntries"
          :key="entry.organization + entry.role"
          :entry="entry"
        />
      </div>
    </section>

    <section
      id="education"
      data-section="education"
      class="mb-12 scroll-mt-24 sm:scroll-mt-28"
    >
      <h2 class="font-display text-2xl font-semibold text-muted-pale mb-6">
        {{ home?.education?.title ?? 'Education' }}
      </h2>
      <div class="flex flex-col gap-6">
        <div
          v-for="entry in educationEntries"
          :key="entry.school + entry.degree"
          class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 transition-all duration-300 hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)]"
          v-motion="motionItem"
        >
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 class="font-display font-semibold text-lg text-muted-pale">
                {{ entry.school }}
              </h3>
              <p class="mt-1 text-sm text-muted-light">
                {{ entry.degree }}, {{ entry.field }}
              </p>
              <p class="mt-0.5 text-xs text-muted">
                {{ entry.period }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal/20 text-teal hover:bg-teal/30 transition-colors text-sm font-medium shrink-0"
              @click="openDiploma(entry)"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View diploma
            </button>
          </div>
        </div>
      </div>
    </section>

    <SectionsTestimonialsSection
      :title="home?.testimonials?.title ?? 'Testimonials'"
      :description="home?.testimonials?.description"
    />

    <section
      id="projects"
      data-section="projects"
      class="mb-12 scroll-mt-24 sm:scroll-mt-28"
    >
      <h2 class="font-display text-2xl font-semibold text-muted-pale mb-2">
        {{ home?.projects?.title ?? 'Projects' }}
      </h2>
      <p class="text-muted-light text-sm mb-6">
        Featured open-source and side projects.
      </p>
      <div v-if="pending" class="flex flex-col gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-2xl border border-teal/20 bg-bg-card h-28 animate-pulse"
        />
      </div>
      <div v-else class="flex flex-col gap-4">
        <CardsProjectCard
          v-for="repo in reposList"
          :key="repo.html_url"
          :repo="repo"
        />
      </div>
    </section>

    <section
      id="contact"
      data-section="contact"
      class="card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] p-6 sm:p-8 scroll-mt-24 sm:scroll-mt-28 transition-all duration-300 hover:border-teal/40 hover:shadow-[0_0_24px_rgba(24,183,164,0.15)]"
    >
      <h2 class="font-display text-2xl font-semibold text-muted-pale mb-4">
        Get in touch
      </h2>
      <p class="text-sm text-muted-light mb-6">
        Fill out the form below and I'll get back to you as soon as possible.
      </p>

      <form
        ref="contactFormRef"
        :action="contactFormAction"
        method="POST"
        class="space-y-4"
        @submit.prevent="handleContactSubmit"
      >
        <div class="space-y-1.5">
          <label for="name" class="block text-sm font-medium text-muted-light">Your name</label>
          <input
            id="name"
            name="name"
            type="text"
            autocomplete="name"
            v-model="contactName"
            class="block w-full rounded-xl px-3 py-2 text-sm text-muted-pale placeholder:text-muted/70 transition-colors bg-bg-card border border-white/10 focus:outline-none"
            :class="contactErrors.name ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:border-teal focus:ring-1 focus:ring-teal'"
            placeholder="John Doe"
          />
          <p v-if="contactErrors.name" class="mt-1 text-xs text-red-400">{{ contactErrors.name }}</p>
        </div>

        <div class="space-y-1.5">
          <label for="email" class="block text-sm font-medium text-muted-light">Your email</label>
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
              <span :style="{ width: emailMeasureWidth + 'px', minWidth: 0 }" class="shrink-0" />
              <span
                class="shrink-0 text-muted cursor-pointer select-none pointer-events-auto hover:text-muted-light"
                @click="applyEmailSuggestion"
              >
                @gmail.com
              </span>
            </div>
            <input
              id="email"
              name="_replyto"
              type="email"
              autocomplete="email"
              v-model="contactEmail"
              @blur="normalizeContactEmail"
              @keydown.tab="onEmailTab"
              class="block w-full rounded-xl px-3 py-2 text-sm text-muted-pale placeholder:text-muted/70 transition-colors bg-bg-card border border-white/10 focus:outline-none"
              :class="contactErrors.email ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:border-teal focus:ring-1 focus:ring-teal'"
              placeholder="you@gmail.com"
            />
          </div>
          <p v-if="contactErrors.email" class="mt-1 text-xs text-red-400">{{ contactErrors.email }}</p>
        </div>

        <div class="space-y-1.5">
          <label for="message" class="block text-sm font-medium text-muted-light">Your message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            v-model="contactMessage"
            class="block w-full rounded-xl px-3 py-2 text-sm text-muted-pale placeholder:text-muted/70 transition-colors bg-bg-card border border-white/10 focus:outline-none resize-y"
            :class="contactErrors.message ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'focus:border-teal focus:ring-1 focus:ring-teal'"
            placeholder="How can I help you?"
          />
          <p v-if="contactErrors.message" class="mt-1 text-xs text-red-400">{{ contactErrors.message }}</p>
        </div>

        <input type="text" name="_gotcha" class="hidden" />

        <ContactTurnstileWidget ref="contactTurnstileRef" />

        <button
          type="submit"
          :disabled="contactSubmitting"
          class="inline-flex items-center justify-center rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-bg hover:bg-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors disabled:opacity-60"
        >
          <span v-if="contactSubmitting">Sending…</span>
          <span v-else>Send message</span>
        </button>
      </form>
    </section>

    <StatusModal
      v-model="contactModalOpen"
      :variant="contactModalVariant"
      :title="contactModalTitle"
      :message="contactModalMessage"
      aria-label="Contact form status"
    />
  </main>
</template>

<script setup lang="ts">
import ContactTurnstileWidget from '~/components/contact/ContactTurnstileWidget.client.vue'
import homeData from '../../data/content/home.json'
import { motionFade, motionItem } from '../../constants/motion'
import { educationEntries, type EducationEntry } from '../../data/education'
import { experienceEntries, EXPERIENCE_DOMAINS, getTotalExperienceDisplay } from '../../data/experience'
import { volunteeringEntries } from '../../data/volunteering'

const props = defineProps<{
  openDiploma: (entry: EducationEntry) => void
}>()

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

const config = useRuntimeConfig().public
const contactFormAction = computed(() => {
  const formId = (config.formspreeFormId as string)?.trim()
  return formId ? `https://formspree.io/f/${formId}` : '#'
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

const home = homeData as {
  about?: { title?: string; paragraphs?: string[] }
  experience?: { title?: string }
  volunteering?: { title?: string }
  education?: { title?: string }
  testimonials?: { title?: string; description?: string }
  projects?: { title?: string }
}

const nuxtApp = useNuxtApp()
const { data: repos, pending } = useFetch<import('../../types/repos').RepoMeta[]>('/api/repos', {
  key: 'repos',
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
})
const reposList = computed(() => (Array.isArray(repos.value) ? repos.value : []))

const emit = defineEmits<{ mounted: [] }>()
onMounted(() => {
  nextTick(() => emit('mounted'))
})
</script>

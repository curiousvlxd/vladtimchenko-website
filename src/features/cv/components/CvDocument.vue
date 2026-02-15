<template>
  <article
    class="cv-document card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] overflow-hidden"
  >
    <header class="cv-headline text-center py-8 px-6 border-b border-teal/20 print:border-gray-300 print:text-black">
      <h1 class="font-display text-2xl font-bold text-muted-pale print:text-black">
        {{ homeName }}
      </h1>
      <p class="mt-1 text-lg text-teal font-medium print:text-black">
        {{ HEADLINE }}
      </p>
      <p class="mt-3 text-sm text-muted-light text-center">
        <a :href="`mailto:${CONTACT.EMAIL}`" class="cv-link hover:text-blue-700">
          {{ CONTACT.EMAIL }}
        </a>
        <span aria-hidden="true">{{ CV_PAGE.CONTACT_SEPARATOR }}</span>
        <span>{{ CONTACT.LOCATION }}</span>
        <template v-for="link in socialLinks" :key="link.label">
          <span aria-hidden="true">{{ CV_PAGE.CONTACT_SEPARATOR }}</span>
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="cv-link hover:text-blue-700"
          >
            {{ link.label }}
          </a>
        </template>
      </p>
    </header>

    <div class="cv-body p-6 space-y-6 text-muted-pale print:text-black">
      <section v-if="profileText">
        <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale print:text-black">
          Profile
        </h2>
        <p class="cv-text text-sm leading-relaxed text-muted-light print:text-black">
          {{ profileText }}
        </p>
      </section>

      <section v-if="coreSkills">
        <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale print:text-black">
          Core Skills
        </h2>
        <p class="text-sm text-muted-light print:text-black">
          {{ coreSkills }}
        </p>
      </section>

      <section>
        <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale print:text-black">
          Experience
        </h2>
        <div class="space-y-4">
          <div
            v-for="entry in experienceEntries"
            :key="`${entry.company}-${entry.role}`"
            class="experience-entry pt-1.5 first:pt-0"
          >
            <p class="flex justify-between items-baseline gap-4 text-sm">
              <span class="font-bold text-muted-pale print:text-black">
                {{ entry.role }}{{ CV_PAGE.CONTACT_SEPARATOR }}{{ entry.company }}
              </span>
              <span class="text-muted-light whitespace-nowrap print:text-black">
                {{ formatPeriod(entry.start, entry.end) }}
              </span>
            </p>
            <p class="text-sm font-bold text-muted-pale mt-2 mb-1 print:text-black">
              Highlights:
            </p>
            <p class="cv-text text-sm leading-relaxed text-muted-light print:text-black">
              {{ entry.roleDescription }}
            </p>
            <ul class="cv-text text-sm mt-1.5 list-none space-y-0.5 text-muted-light print:text-black">
              <li v-for="highlight in entry.highlights" :key="highlight">
                - {{ highlight }}
              </li>
            </ul>
            <div v-if="entry.impact?.length" class="cv-impact mt-2">
              <p class="text-sm text-muted-light print:text-black">
                <span class="font-bold text-muted-pale print:text-black">Impact:</span>
                {{ entry.impact.join(' ') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="educationEntries.length">
        <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale print:text-black">
          Education
        </h2>
        <ul class="text-sm text-muted-light space-y-2 print:text-black">
          <li
            v-for="entry in educationEntries"
            :key="entry.school"
            class="flex justify-between items-baseline gap-4"
          >
            <span>
              <span class="font-bold text-muted-pale print:text-black">
                {{ entry.school }}
              </span>
              {{ CV_PAGE.CONTACT_SEPARATOR }}{{ entry.degree }}, {{ entry.field }}
            </span>
            <span class="text-muted-light whitespace-nowrap print:text-black">
              {{ entry.period }}
            </span>
          </li>
        </ul>
      </section>

      <section v-if="volunteeringEntries.length">
        <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale print:text-black">
          Volunteering
        </h2>
        <div class="space-y-6">
          <div
            v-for="entry in volunteeringEntries"
            :key="`${entry.organization}-${entry.role}`"
            class="volunteering-entry pt-2 first:pt-0"
          >
            <p class="flex justify-between items-baseline gap-4 text-sm">
              <span class="font-bold text-muted-pale print:text-black">
                {{ entry.role }}{{ CV_PAGE.CONTACT_SEPARATOR }}{{ entry.organization }}
              </span>
              <span class="text-muted-light whitespace-nowrap print:text-black">
                {{ formatVolunteeringPeriod(entry.start, entry.end) }}
              </span>
            </p>
            <p class="cv-text text-sm mt-2 leading-relaxed text-muted-light print:text-black">
              {{ entry.description }}
            </p>
            <p class="text-sm font-bold text-muted-pale mt-2 mb-1 print:text-black">
              Highlights:
            </p>
            <ul class="cv-text text-sm mt-1.5 list-none space-y-0.5 text-muted-light print:text-black">
              <li v-for="highlight in entry.highlights" :key="highlight">
                - {{ highlight }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { CONTACT, HEADLINE } from '~/common/constants'
import { CV_PAGE } from '~/features/cv/constants'
import { formatPeriod, type ExperienceEntry } from '~/data/experience'
import { type EducationEntry } from '~/data/education'
import {
  formatVolunteeringPeriod,
  type VolunteeringEntry
} from '~/data/volunteering'

defineProps<{
  homeName: string
  profileText: string
  coreSkills: string
  experienceEntries: ExperienceEntry[]
  educationEntries: EducationEntry[]
  volunteeringEntries: VolunteeringEntry[]
}>()

const socialLinks = [
  { label: 'LinkedIn', href: CONTACT.LINKEDIN },
  { label: 'GitHub', href: CONTACT.GITHUB },
  { label: 'Telegram', href: CONTACT.TELEGRAM }
] as const
</script>

<style scoped src="./CvDocument.css"></style>


<template>
  <div class="cv-page mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
    <div class="cv-actions no-print mb-6 flex flex-wrap items-center gap-3">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-muted-light hover:text-teal transition-colors">
        <AppIcon name="back" class="w-4 h-4" />
        Back
      </NuxtLink>
      <button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal/20 text-teal hover:bg-teal/30 transition-colors text-sm font-medium disabled:opacity-60" :disabled="pdfExporting" @click="exportPdf">
        <AppIcon v-if="!pdfExporting" name="download" class="w-4 h-4" />
        <span v-else class="size-4 shrink-0 inline-block rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
        <span v-if="pdfExporting">Exporting…</span>
        <span v-else>Export to PDF</span>
      </button>
    </div>

    <article ref="cvDocumentRef" class="cv-document card-gradient-animated rounded-2xl border border-teal/20 bg-[rgba(24,183,164,0.05)] overflow-hidden">
      <header class="cv-headline text-center py-8 px-6 border-b border-teal/20 print:border-gray-300 print:text-black">
        <h1 class="font-display text-2xl font-bold text-muted-pale print:text-black">{{ home?.name ?? '' }}</h1>
        <p class="mt-1 text-lg text-teal font-medium print:text-black">{{ HEADLINE }}</p>
        <p class="mt-3 text-sm text-muted-light text-center">
          <a :href="`mailto:${CONTACT.EMAIL}`" class="cv-link text-blue-600 underline hover:text-blue-700">{{ CONTACT.EMAIL }}</a>
          <span aria-hidden="true"> · </span>
          <span>{{ CONTACT.LOCATION }}</span>
          <span aria-hidden="true"> · </span>
          <a :href="CONTACT.LINKEDIN" target="_blank" rel="noopener noreferrer" class="cv-link text-blue-600 underline hover:text-blue-700">LinkedIn</a>
          <span aria-hidden="true"> · </span>
          <a :href="CONTACT.GITHUB" target="_blank" rel="noopener noreferrer" class="cv-link text-blue-600 underline hover:text-blue-700">GitHub</a>
          <span aria-hidden="true"> · </span>
          <a :href="CONTACT.TELEGRAM" target="_blank" rel="noopener noreferrer" class="cv-link text-blue-600 underline hover:text-blue-700">Telegram</a>
        </p>
      </header>

      <div class="cv-body p-6 space-y-6 text-muted-pale print:text-black">
        <section v-if="profileText">
          <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale mb-2 print:text-black">Profile</h2>
          <p class="cv-text text-sm leading-relaxed text-muted-light print:text-black">{{ profileText }}</p>
        </section>

        <section v-if="cv.coreSkills">
          <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale mb-2 print:text-black">Core Skills</h2>
          <p class="text-sm text-muted-light print:text-black">{{ cv.coreSkills }}</p>
        </section>

        <section>
          <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale mb-2 print:text-black">Experience</h2>
          <div class="space-y-4">
            <div v-for="entry in experienceEntries" :key="entry.company + entry.role" class="experience-entry pt-1.5 first:pt-0">
              <p class="flex justify-between items-baseline gap-4 text-sm">
                <span class="font-bold text-muted-pale print:text-black">{{ entry.role }} · {{ entry.company }}</span>
                <span class="text-muted-light whitespace-nowrap print:text-black">{{ formatPeriod(entry.start, entry.end) }}</span>
              </p>
              <p class="text-sm font-bold text-muted-pale mt-2 mb-1 print:text-black">Highlights:</p>
              <p class="cv-text text-sm leading-relaxed text-muted-light print:text-black">{{ entry.roleDescription }}</p>
              <ul class="cv-text text-sm mt-1.5 list-none space-y-0.5 text-muted-light print:text-black">
                <li v-for="(h, i) in entry.highlights" :key="i">- {{ h }}</li>
              </ul>
              <div v-if="entry.impact?.length" class="cv-impact mt-2">
                <p class="text-sm text-muted-light print:text-black"><span class="font-bold text-muted-pale print:text-black">Impact:</span> {{ entry.impact.join(' ') }}</p>
              </div>
            </div>
          </div>
        </section>

        <section v-if="educationEntries.length">
          <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale mb-2 print:text-black">Education</h2>
          <ul class="text-sm text-muted-light space-y-2 print:text-black">
            <li v-for="entry in educationEntries" :key="entry.school" class="flex justify-between items-baseline gap-4">
              <span><span class="font-bold text-muted-pale print:text-black">{{ entry.school }}</span> · {{ entry.degree }}, {{ entry.field }}</span>
              <span class="text-muted-light whitespace-nowrap print:text-black">{{ entry.period }}</span>
            </li>
          </ul>
        </section>

        <section v-if="volunteeringEntries.length">
          <h2 class="cv-heading text-sm font-bold uppercase tracking-wide text-muted-pale mb-2 print:text-black">Volunteering</h2>
          <div class="space-y-6">
            <div v-for="entry in volunteeringEntries" :key="entry.organization + entry.role" class="volunteering-entry pt-2 first:pt-0">
              <p class="flex justify-between items-baseline gap-4 text-sm">
                <span class="font-bold text-muted-pale print:text-black">{{ entry.role }} · {{ entry.organization }}</span>
                <span class="text-muted-light whitespace-nowrap print:text-black">{{ formatVolunteeringPeriod(entry.start, entry.end) }}</span>
              </p>
              <p class="cv-text text-sm mt-2 leading-relaxed text-muted-light print:text-black">{{ entry.description }}</p>
              <p class="text-sm font-bold text-muted-pale mt-2 mb-1 print:text-black">Highlights:</p>
              <ul class="cv-text text-sm mt-1.5 list-none space-y-0.5 text-muted-light print:text-black">
                <li v-for="(h, i) in entry.highlights" :key="i">- {{ h }}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import homeData from '../data/content/home.json'
import { CONTACT, HEADLINE } from '../constants'
import cvData from '../data/content/cv.json'
import { experienceEntries, formatPeriod } from '../data/experience'
import { educationEntries } from '../data/education'
import { volunteeringEntries, formatVolunteeringPeriod } from '../data/volunteering'

const home = homeData as { name?: string; title?: string; about?: { paragraphs?: string[] } }
const cv = cvData as { coreSkills?: string }
const profileText = home?.about?.paragraphs?.[0] ?? ''

const config = useRuntimeConfig()
const siteUrl = ((config.public?.siteUrl as string) || 'https://vladtimchenko.dev').replace(/\/+$/, '')
const cvUrl = `${siteUrl}/cv`
const cvTitle = `CV · ${home?.name ?? ''}`
const cvDescription = 'Resume and experience: cloud-native .NET, backend, Google Cloud.'
useHead({
  title: cvTitle,
  link: [{ rel: 'canonical', href: cvUrl }],
  meta: [
    { name: 'description', content: cvDescription },
    { property: 'og:title', content: cvTitle },
    { property: 'og:description', content: cvDescription },
    { property: 'og:url', content: cvUrl },
    { property: 'og:image', content: `${siteUrl}/me.jpg` },
    { property: 'og:type', content: 'profile' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: cvTitle },
    { name: 'twitter:description', content: cvDescription },
    { name: 'twitter:image', content: `${siteUrl}/me.jpg` }
  ]
})

const cvDocumentRef = ref<HTMLElement | null>(null)
const pdfExporting = ref(false)

async function exportPdf () {
  if (pdfExporting.value) return
  pdfExporting.value = true
  const slug = (home?.name ?? 'CV').replace(/\s+/g, '_')
  const filename = `CV_${slug}.pdf`
  try {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const margin = 18
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const contentW = pageW - margin * 2
    let y = margin
    const lineH = 5
    const smallH = 4
    const gap = 3
    const sectionGap = 6
    const entryGap = 3
    const beforeImpactGap = 2

    function checkPage (needLines = 1) {
      const space = pageH - margin - y
      if (space < needLines * lineH) {
        doc.addPage()
        y = margin
      }
    }

    function writeText (text: string, opts?: { maxWidth?: number; lineHeight?: number; fontSize?: number }) {
      const maxWidth = opts?.maxWidth ?? contentW
      const lh = opts?.lineHeight ?? lineH
      const fs = opts?.fontSize
      if (fs) doc.setFontSize(fs)
      const lines = doc.splitTextToSize(text, maxWidth)
      for (const line of lines) {
        checkPage()
        doc.text(line, margin, y)
        y += lh
      }
      if (fs) doc.setFontSize(10)
      return y
    }

    function sectionTitle (title: string) {
      checkPage(2)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(title, margin, y)
      y += smallH + 2
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(home?.name ?? '', pageW / 2, y, { align: 'center' })
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(HEADLINE, pageW / 2, y, { align: 'center' })
    y += 6
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const sep = ' · '
    const parts = [
      { text: CONTACT.EMAIL, url: `mailto:${CONTACT.EMAIL}` },
      { text: CONTACT.LOCATION },
      { text: 'LinkedIn', url: CONTACT.LINKEDIN },
      { text: 'GitHub', url: CONTACT.GITHUB },
      { text: 'Telegram', url: CONTACT.TELEGRAM }
    ]
    let totalW = 0
    for (let i = 0; i < parts.length; i++) {
      totalW += doc.getTextWidth(parts[i].text)
      if (i < parts.length - 1) totalW += doc.getTextWidth(sep)
    }
    let cx = (pageW - totalW) / 2
    const blue = [37, 99, 235]
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (p.url) {
        doc.setTextColor(blue[0], blue[1], blue[2])
        doc.textWithLink(p.text, cx, y, { url: p.url })
        const linkW = doc.getTextWidth(p.text)
        doc.setDrawColor(blue[0], blue[1], blue[2])
        doc.setLineWidth(0.2)
        doc.line(cx, y + 1.2, cx + linkW, y + 1.2)
        doc.setDrawColor(0, 0, 0)
        doc.setTextColor(0, 0, 0)
      } else {
        doc.text(p.text, cx, y)
      }
      cx += doc.getTextWidth(p.text)
      if (i < parts.length - 1) {
        doc.text(sep, cx, y)
        cx += doc.getTextWidth(sep)
      }
    }
    y += smallH + sectionGap

    if (profileText) {
      sectionTitle('PROFILE')
      writeText(profileText)
      y += sectionGap
    }

    if (cv.coreSkills) {
      sectionTitle('CORE SKILLS')
      writeText(cv.coreSkills)
      y += sectionGap
    }

    sectionTitle('EXPERIENCE')
    for (let idx = 0; idx < experienceEntries.length; idx++) {
      const entry = experienceEntries[idx]
      if (idx > 0) y += 2
      checkPage(4)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      const roleCompany = `${entry.role} · ${entry.company}`
      const periodStr = formatPeriod(entry.start, entry.end)
      const periodW = doc.getTextWidth(periodStr)
      const roleMaxW = contentW - periodW - 3
      const roleLines = doc.splitTextToSize(roleCompany, roleMaxW)
      doc.text(roleLines[0], margin, y)
      doc.text(periodStr, margin + contentW, y, { align: 'right' })
      y += smallH + 1
      if (roleLines.length > 1) {
        for (let r = 1; r < roleLines.length; r++) {
          doc.text(roleLines[r], margin, y)
          y += smallH
        }
      }
      doc.setFont('helvetica', 'bold')
      doc.text('Highlights:', margin, y)
      y += smallH
      doc.setFont('helvetica', 'normal')
      writeText(entry.roleDescription, { lineHeight: smallH })
      for (const h of entry.highlights) {
        writeText(`- ${h}`, { lineHeight: smallH })
      }
      if (entry.impact?.length) {
        y += beforeImpactGap
        doc.setFont('helvetica', 'bold')
        doc.text('Impact: ', margin, y)
        const impactLabelW = doc.getTextWidth('Impact: ')
        doc.setFont('helvetica', 'normal')
        const impactText = entry.impact.join(' ')
        const impactLines = doc.splitTextToSize(impactText, contentW - impactLabelW)
        if (impactLines.length) {
          doc.text(impactLines[0], margin + impactLabelW, y)
          y += smallH
          for (let i = 1; i < impactLines.length; i++) {
            checkPage()
            doc.text(impactLines[i], margin, y)
            y += smallH
          }
        }
      }
      y += entryGap
    }
    y += sectionGap - entryGap

    if (educationEntries.length) {
      sectionTitle('EDUCATION')
      for (const entry of educationEntries) {
        checkPage()
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        const schoolLine = `${entry.school} · ${entry.degree}, ${entry.field}`
        const periodW = doc.getTextWidth(entry.period)
        const schoolMaxW = contentW - periodW - 3
        const schoolLines = doc.splitTextToSize(schoolLine, schoolMaxW)
        doc.text(schoolLines[0], margin, y)
        doc.text(entry.period, margin + contentW, y, { align: 'right' })
        y += smallH
        if (schoolLines.length > 1) {
          for (let r = 1; r < schoolLines.length; r++) {
            doc.text(schoolLines[r], margin, y)
            y += smallH
          }
        }
        y += 2
      }
      y += sectionGap - 2
    }

    if (volunteeringEntries.length) {
      sectionTitle('VOLUNTEERING')
      for (let vidx = 0; vidx < volunteeringEntries.length; vidx++) {
        const entry = volunteeringEntries[vidx]
        if (vidx > 0) y += 3
        checkPage(4)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        const roleOrg = `${entry.role} · ${entry.organization}`
        doc.text(roleOrg, margin, y)
        doc.text(formatVolunteeringPeriod(entry.start, entry.end), margin + contentW, y, { align: 'right' })
        y += smallH
        doc.setFont('helvetica', 'normal')
        writeText(entry.description, { lineHeight: smallH })
        doc.setFont('helvetica', 'bold')
        doc.text('Highlights:', margin, y)
        y += smallH
        doc.setFont('helvetica', 'normal')
        for (const h of entry.highlights) {
          writeText(`- ${h}`, { lineHeight: smallH })
        }
        y += entryGap
      }
    }

    doc.save(filename)
  } finally {
    pdfExporting.value = false
  }
}
</script>

<style scoped>
.cv-heading { margin-bottom: 0.25rem; }
.cv-link { color: rgb(37, 99, 235); text-decoration: underline; }
@media print { .cv-link { color: rgb(37, 99, 235) !important; text-decoration: underline !important; } }
</style>

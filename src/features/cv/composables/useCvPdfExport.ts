import { CONTACT, HEADLINE } from '~/common/constants'
import { CV_PAGE, CV_PDF_RULES } from '~/features/cv/constants'
import { formatPeriod, type ExperienceEntry } from '~/data/experience'
import { type EducationEntry } from '~/data/education'
import {
  formatVolunteeringPeriod,
  type VolunteeringEntry
} from '~/data/volunteering'

interface CvPdfPayload {
  homeName: string
  profileText: string
  coreSkills: string
  experienceEntries: ExperienceEntry[]
  educationEntries: EducationEntry[]
  volunteeringEntries: VolunteeringEntry[]
}

type CvPdfPayloadGetter = () => CvPdfPayload

function buildFileName(homeName: string): string {
  const safeName = (homeName || CV_PAGE.PDF_FILE_FALLBACK_NAME).replace(/\s+/g, '_')
  return `${CV_PAGE.PDF_FILE_PREFIX}_${safeName}.pdf`
}

export function useCvPdfExport(getPayload: CvPdfPayloadGetter) {
  const pdfExporting = ref(false)

  async function exportPdf() {
    if (pdfExporting.value) return

    pdfExporting.value = true

    const payload = getPayload()
    const filename = buildFileName(payload.homeName)

    try {
      const { default: jsPDF } = await import('jspdf')

      const doc = new jsPDF({
        unit: CV_PDF_RULES.DOCUMENT.UNIT,
        format: CV_PDF_RULES.DOCUMENT.FORMAT,
        orientation: CV_PDF_RULES.DOCUMENT.ORIENTATION
      })

      const margin = CV_PDF_RULES.LAYOUT.MARGIN_MM
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const contentW = pageW - margin * 2
      const lineH = CV_PDF_RULES.LAYOUT.LINE_HEIGHT_MM
      const smallH = CV_PDF_RULES.LAYOUT.SMALL_LINE_HEIGHT_MM

      let y = margin

      function checkPage(needLines = 1) {
        const space = pageH - margin - y

        if (space < needLines * lineH) {
          doc.addPage()
          y = margin
        }
      }

      function writeText(
        text: string,
        opts?: { maxWidth?: number; lineHeight?: number; fontSize?: number }
      ) {
        const maxWidth = opts?.maxWidth ?? contentW
        const lineHeight = opts?.lineHeight ?? lineH
        const fontSize = opts?.fontSize

        if (fontSize) {
          doc.setFontSize(fontSize)
        }

        const lines = doc.splitTextToSize(text, maxWidth)

        for (const line of lines) {
          checkPage()
          doc.text(line, margin, y)
          y += lineHeight
        }

        if (fontSize) {
          doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.BODY_FONT_SIZE_PT)
        }
      }

      function sectionTitle(title: string) {
        checkPage(2)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.SECTION_TITLE_FONT_SIZE_PT)
        doc.text(title, margin, y)
        y += smallH + CV_PDF_RULES.SPACING.HEADING_BOTTOM_MM
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.BODY_FONT_SIZE_PT)
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.NAME_FONT_SIZE_PT)
      doc.text(payload.homeName, pageW / 2, y, { align: 'center' })
      y += CV_PDF_RULES.SPACING.NAME_BOTTOM_MM

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.HEADLINE_FONT_SIZE_PT)
      doc.text(HEADLINE, pageW / 2, y, { align: 'center' })
      y += CV_PDF_RULES.SPACING.HEADLINE_BOTTOM_MM

      doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.BODY_FONT_SIZE_PT)
      const separator = CV_PAGE.CONTACT_SEPARATOR
      const contactParts = [
        { text: CONTACT.EMAIL, url: `mailto:${CONTACT.EMAIL}` },
        { text: CONTACT.LOCATION },
        { text: 'LinkedIn', url: CONTACT.LINKEDIN },
        { text: 'GitHub', url: CONTACT.GITHUB },
        { text: 'Telegram', url: CONTACT.TELEGRAM }
      ]

      let totalW = 0

      for (let index = 0; index < contactParts.length; index += 1) {
        totalW += doc.getTextWidth(contactParts[index].text)

        if (index < contactParts.length - 1) {
          totalW += doc.getTextWidth(separator)
        }
      }

      let x = (pageW - totalW) / 2
      const [linkR, linkG, linkB] = CV_PDF_RULES.COLORS.LINK_RGB
      const [blackR, blackG, blackB] = CV_PDF_RULES.COLORS.BLACK_RGB

      for (let index = 0; index < contactParts.length; index += 1) {
        const item = contactParts[index]

        if (item.url) {
          doc.setTextColor(linkR, linkG, linkB)
          doc.textWithLink(item.text, x, y, { url: item.url })
          const linkWidth = doc.getTextWidth(item.text)
          doc.setDrawColor(linkR, linkG, linkB)
          doc.setLineWidth(CV_PDF_RULES.LINK.UNDERLINE_WIDTH_MM)
          doc.line(
            x,
            y + CV_PDF_RULES.LINK.UNDERLINE_OFFSET_MM,
            x + linkWidth,
            y + CV_PDF_RULES.LINK.UNDERLINE_OFFSET_MM
          )
          doc.setDrawColor(blackR, blackG, blackB)
          doc.setTextColor(blackR, blackG, blackB)
        } else {
          doc.text(item.text, x, y)
        }

        x += doc.getTextWidth(item.text)

        if (index < contactParts.length - 1) {
          doc.text(separator, x, y)
          x += doc.getTextWidth(separator)
        }
      }

      y += smallH + CV_PDF_RULES.LAYOUT.SECTION_GAP_MM

      if (payload.profileText) {
        sectionTitle('PROFILE')
        writeText(payload.profileText)
        y += CV_PDF_RULES.LAYOUT.SECTION_GAP_MM
      }

      if (payload.coreSkills) {
        sectionTitle('CORE SKILLS')
        writeText(payload.coreSkills)
        y += CV_PDF_RULES.LAYOUT.SECTION_GAP_MM
      }

      sectionTitle('EXPERIENCE')

      for (let index = 0; index < payload.experienceEntries.length; index += 1) {
        const entry = payload.experienceEntries[index]

        if (index > 0) {
          y += CV_PDF_RULES.SPACING.EXPERIENCE_TOP_MM
        }

        checkPage(4)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.BODY_FONT_SIZE_PT)

        const roleCompany = `${entry.role}${CV_PAGE.CONTACT_SEPARATOR}${entry.company}`
        const periodText = formatPeriod(entry.start, entry.end)
        const periodW = doc.getTextWidth(periodText)
        const roleMaxW = contentW - periodW - CV_PDF_RULES.LAYOUT.PERIOD_SPACING_MM
        const roleLines = doc.splitTextToSize(roleCompany, roleMaxW)

        doc.text(roleLines[0], margin, y)
        doc.text(periodText, margin + contentW, y, { align: 'right' })
        y += smallH + 1

        if (roleLines.length > 1) {
          for (let roleLineIndex = 1; roleLineIndex < roleLines.length; roleLineIndex += 1) {
            doc.text(roleLines[roleLineIndex], margin, y)
            y += smallH
          }
        }

        doc.setFont('helvetica', 'bold')
        doc.text('Highlights:', margin, y)
        y += smallH

        doc.setFont('helvetica', 'normal')
        writeText(entry.roleDescription, { lineHeight: smallH })

        for (const highlight of entry.highlights) {
          writeText(`- ${highlight}`, { lineHeight: smallH })
        }

        if (entry.impact?.length) {
          y += CV_PDF_RULES.LAYOUT.BEFORE_IMPACT_GAP_MM
          doc.setFont('helvetica', 'bold')
          doc.text('Impact: ', margin, y)
          const impactLabelW = doc.getTextWidth('Impact: ')
          doc.setFont('helvetica', 'normal')

          const impactLines = doc.splitTextToSize(
            entry.impact.join(' '),
            contentW - impactLabelW
          )

          if (impactLines.length > 0) {
            doc.text(impactLines[0], margin + impactLabelW, y)
            y += smallH

            for (let lineIndex = 1; lineIndex < impactLines.length; lineIndex += 1) {
              checkPage()
              doc.text(impactLines[lineIndex], margin, y)
              y += smallH
            }
          }
        }

        y += CV_PDF_RULES.LAYOUT.ENTRY_GAP_MM
      }

      y += CV_PDF_RULES.LAYOUT.SECTION_GAP_MM - CV_PDF_RULES.LAYOUT.ENTRY_GAP_MM

      if (payload.educationEntries.length > 0) {
        sectionTitle('EDUCATION')

        for (const entry of payload.educationEntries) {
          checkPage()
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.BODY_FONT_SIZE_PT)

          const schoolLine = `${entry.school}${CV_PAGE.CONTACT_SEPARATOR}${entry.degree}, ${entry.field}`
          const periodW = doc.getTextWidth(entry.period)
          const schoolMaxW = contentW - periodW - CV_PDF_RULES.LAYOUT.PERIOD_SPACING_MM
          const schoolLines = doc.splitTextToSize(schoolLine, schoolMaxW)

          doc.text(schoolLines[0], margin, y)
          doc.text(entry.period, margin + contentW, y, { align: 'right' })
          y += smallH

          if (schoolLines.length > 1) {
            for (let lineIndex = 1; lineIndex < schoolLines.length; lineIndex += 1) {
              doc.text(schoolLines[lineIndex], margin, y)
              y += smallH
            }
          }

          y += CV_PDF_RULES.LAYOUT.BEFORE_IMPACT_GAP_MM
        }

        y += CV_PDF_RULES.LAYOUT.SECTION_GAP_MM - CV_PDF_RULES.LAYOUT.BEFORE_IMPACT_GAP_MM
      }

      if (payload.volunteeringEntries.length > 0) {
        sectionTitle('VOLUNTEERING')

        for (let index = 0; index < payload.volunteeringEntries.length; index += 1) {
          const entry = payload.volunteeringEntries[index]

          if (index > 0) {
            y += CV_PDF_RULES.SPACING.VOLUNTEERING_TOP_MM
          }

          checkPage(4)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(CV_PDF_RULES.TYPOGRAPHY.BODY_FONT_SIZE_PT)
          doc.text(
            `${entry.role}${CV_PAGE.CONTACT_SEPARATOR}${entry.organization}`,
            margin,
            y
          )
          doc.text(
            formatVolunteeringPeriod(entry.start, entry.end),
            margin + contentW,
            y,
            { align: 'right' }
          )
          y += smallH

          doc.setFont('helvetica', 'normal')
          writeText(entry.description, { lineHeight: smallH })

          doc.setFont('helvetica', 'bold')
          doc.text('Highlights:', margin, y)
          y += smallH
          doc.setFont('helvetica', 'normal')

          for (const highlight of entry.highlights) {
            writeText(`- ${highlight}`, { lineHeight: smallH })
          }

          y += CV_PDF_RULES.LAYOUT.ENTRY_GAP_MM
        }
      }

      doc.save(filename)
    } finally {
      pdfExporting.value = false
    }
  }

  return {
    pdfExporting,
    exportPdf
  }
}


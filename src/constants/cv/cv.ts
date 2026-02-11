export const CV_PAGE = {
  PATH: '/cv',
  TITLE_PREFIX: 'CV \u00b7 ',
  DESCRIPTION:
    'Resume and experience: cloud-native .NET, backend, Google Cloud.',
  OG_IMAGE_PATH: '/me.jpg',
  BACK_LABEL: 'Back',
  PDF_EXPORT_LABEL: 'Export to PDF',
  PDF_EXPORTING_LABEL: 'Exporting...',
  PDF_FILE_PREFIX: 'CV',
  PDF_FILE_FALLBACK_NAME: 'CV',
  CONTACT_SEPARATOR: ' \u00b7 '
} as const

export const CV_PDF_RULES = {
  DOCUMENT: {
    UNIT: 'mm',
    FORMAT: 'a4',
    ORIENTATION: 'portrait'
  },
  LAYOUT: {
    MARGIN_MM: 18,
    LINE_HEIGHT_MM: 5,
    SMALL_LINE_HEIGHT_MM: 4,
    SECTION_GAP_MM: 6,
    ENTRY_GAP_MM: 3,
    BEFORE_IMPACT_GAP_MM: 2,
    PERIOD_SPACING_MM: 3
  },
  TYPOGRAPHY: {
    NAME_FONT_SIZE_PT: 18,
    HEADLINE_FONT_SIZE_PT: 11,
    BODY_FONT_SIZE_PT: 9,
    SECTION_TITLE_FONT_SIZE_PT: 10
  },
  SPACING: {
    NAME_BOTTOM_MM: 7,
    HEADLINE_BOTTOM_MM: 6,
    HEADING_BOTTOM_MM: 2,
    EXPERIENCE_TOP_MM: 2,
    VOLUNTEERING_TOP_MM: 3
  },
  LINK: {
    UNDERLINE_WIDTH_MM: 0.2,
    UNDERLINE_OFFSET_MM: 1.2
  },
  COLORS: {
    LINK_RGB: [37, 99, 235] as const,
    BLACK_RGB: [0, 0, 0] as const
  }
} as const

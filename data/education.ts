export interface EducationEntry {
  school: string
  degree: string
  field: string
  period: string
  diplomaUrl: string
}

export const educationEntries: EducationEntry[] = [
  {
    school: 'Odesa Technological University "STEP"',
    degree: "Bachelor's degree",
    field: 'Computer science',
    period: 'Sep 2019 - Jul 2023',
    diplomaUrl: '/documents/diploma.pdf'
  }
]

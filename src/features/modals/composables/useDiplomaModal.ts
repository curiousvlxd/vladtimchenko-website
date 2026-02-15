export interface DiplomaEntry {
  diplomaUrl: string
  school: string
}

export interface UseDiplomaModalReturn {
  open: Ref<boolean>
  pdfUrl: Ref<string>
  title: Ref<string>
  openDiploma: (entry: DiplomaEntry) => void
}

export function useDiplomaModal(): UseDiplomaModalReturn {
  const open = ref(false)
  const pdfUrl = ref('')
  const title = ref('Diploma')

  function openDiploma(entry: DiplomaEntry) {
    pdfUrl.value = entry.diplomaUrl
    title.value = `${entry.school} · Diploma`
    nextTick(() => {
      open.value = true
    })
  }

  return {
    open,
    pdfUrl,
    title,
    openDiploma
  }
}

import { useCallback, useState } from 'react'
import type { PdfFileItem } from '../types'

function createId(): string {
  return crypto.randomUUID()
}

/** Manage the list of PDF files dropped by the user */
export function usePdfFiles() {
  const [files, setFiles] = useState<PdfFileItem[]>([])

  const addFiles = useCallback((incoming: File[]) => {
    const pdfs = incoming.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    if (pdfs.length === 0) return

    const items: PdfFileItem[] = pdfs.map((file) => ({
      id: createId(),
      file,
      name: file.name,
    }))

    setFiles((prev) => [...prev, ...items])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
  }, [])

  return { files, addFiles, removeFile, clearFiles }
}

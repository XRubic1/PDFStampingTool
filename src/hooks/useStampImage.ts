import { useCallback, useState } from 'react'

/** Manage the stamp image upload and object URL for preview */
export function useStampImage() {
  const [stampFile, setStampFile] = useState<File | null>(null)
  const [stampUrl, setStampUrl] = useState<string | null>(null)

  const setStamp = useCallback((file: File | null) => {
    setStampUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
    setStampFile(file)
  }, [])

  return { stampFile, stampUrl, setStamp }
}

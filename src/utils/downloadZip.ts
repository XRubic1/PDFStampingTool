import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/** Bundle stamped PDFs into a zip and trigger download */
export async function downloadStampedPdfs(
  files: { name: string; bytes: Uint8Array }[],
): Promise<void> {
  if (files.length === 1) {
    const blob = new Blob([files[0].bytes], { type: 'application/pdf' })
    saveAs(blob, files[0].name)
    return
  }

  const zip = new JSZip()
  for (const { name, bytes } of files) {
    zip.file(name, bytes)
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'stamped_pdfs.zip')
}

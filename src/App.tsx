import { useCallback, useState } from 'react'
import { PdfDropZone } from './components/PdfDropZone'
import { PdfFileList } from './components/PdfFileList'
import { PdfPreview } from './components/PdfPreview'
import { StampUpload } from './components/StampUpload'
import { usePdfFiles } from './hooks/usePdfFiles'
import { useStampImage } from './hooks/useStampImage'
import type { PreviewDimensions, StampPlacement } from './types'
import { downloadStampedPdfs } from './utils/downloadZip'
import { fileToArrayBuffer, stampPdfFirstPage } from './utils/stampPdf'

const DEFAULT_PLACEMENT: StampPlacement = {
  x: 40,
  y: 40,
  width: 120,
  height: 120,
}

export default function App() {
  const { files, addFiles, removeFile } = usePdfFiles()
  const { stampFile, stampUrl, setStamp } = useStampImage()
  const [placement, setPlacement] = useState<StampPlacement>(DEFAULT_PLACEMENT)
  const [previewDims, setPreviewDims] = useState<PreviewDimensions | null>(null)
  const [isStamping, setIsStamping] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const firstPdf = files[0]?.file ?? null
  const canStamp =
    files.length > 0 && stampFile !== null && previewDims !== null && !isStamping

  const handleStamp = useCallback(async () => {
    if (!stampFile || !previewDims || files.length === 0) return

    setIsStamping(true)
    setError(null)
    setStatus('Stamping PDFs…')

    try {
      const stampBytes = await fileToArrayBuffer(stampFile)
      const mime = stampFile.type || 'image/png'

      const results: { name: string; bytes: Uint8Array }[] = []

      for (let i = 0; i < files.length; i++) {
        setStatus(`Stamping ${i + 1} of ${files.length}…`)
        const pdfBytes = await fileToArrayBuffer(files[i].file)
        const stamped = await stampPdfFirstPage(
          pdfBytes,
          stampBytes,
          mime,
          placement,
          previewDims,
        )
        results.push({ name: files[i].name, bytes: stamped })
      }

      await downloadStampedPdfs(results)
      setStatus(`Done! ${results.length} PDF${results.length !== 1 ? 's' : ''} stamped.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stamp PDFs'
      setError(message)
      setStatus(null)
    } finally {
      setIsStamping(false)
    }
  }, [files, stampFile, previewDims, placement])

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 lg:h-dvh lg:overflow-hidden">
      <header className="shrink-0 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              PDF Stamping Tool
            </h1>
          </div>
          <a
            href="https://github.com/XRubic1/PDFStampingTool"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200 sm:block"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col px-4 py-3 sm:px-6 lg:py-4">
        <div className="grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[280px_1fr] lg:gap-5">
          <aside className="flex min-h-0 flex-col gap-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-3 shadow-xl shadow-black/20 lg:max-h-full">
            <div className="shrink-0">
              <PdfDropZone
                onFilesAdded={addFiles}
                disabled={isStamping}
                compact={files.length > 0}
              />
            </div>

            <PdfFileList files={files} onRemove={removeFile} />

            <div className="mt-auto shrink-0 space-y-2 border-t border-slate-800 pt-2">
              <StampUpload stampUrl={stampUrl} onStampSelect={setStamp} />

              <button
                type="button"
                disabled={!canStamp}
                onClick={handleStamp}
                className={[
                  'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  canStamp
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 hover:shadow-sky-400/30 active:scale-[0.98]'
                    : 'cursor-not-allowed bg-slate-800 text-slate-500',
                ].join(' ')}
              >
                {isStamping ? 'Stamping…' : `Stamp ${files.length || ''} PDF${files.length !== 1 ? 's' : ''}`}
              </button>

              {status && (
                <p className="animate-pulse text-center text-xs text-sky-400">{status}</p>
              )}
              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
                  {error}
                </p>
              )}
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <PdfPreview
              pdfFile={firstPdf}
              stampUrl={stampUrl}
              placement={placement}
              onPlacementChange={setPlacement}
              onPreviewDimensions={setPreviewDims}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

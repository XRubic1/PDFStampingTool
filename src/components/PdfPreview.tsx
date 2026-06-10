import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import type { PreviewDimensions, StampPlacement } from '../types'
import { StampOverlay } from './StampOverlay'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfPreviewProps {
  pdfFile: File | null
  stampUrl: string | null
  placement: StampPlacement
  onPlacementChange: (placement: StampPlacement) => void
  onPreviewDimensions: (dims: PreviewDimensions) => void
}

/** Fit a page inside a box while preserving aspect ratio */
function fitPageInBox(
  boxWidth: number,
  boxHeight: number,
  pageAspect: number,
): { width: number; height: number } | null {
  if (boxWidth <= 0 || boxHeight <= 0) return null

  let width = boxWidth
  let height = width * pageAspect

  if (height > boxHeight) {
    height = boxHeight
    width = height / pageAspect
  }

  return { width, height }
}

/** Renders page 1 scaled to fit the available viewport area */
export function PdfPreview({
  pdfFile,
  stampUrl,
  placement,
  onPlacementChange,
  onPreviewDimensions,
}: PdfPreviewProps) {
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [pageAspect, setPageAspect] = useState<number | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(false)

  const renderSize = useMemo(
    () =>
      pageAspect
        ? fitPageInBox(containerSize.width, containerSize.height, pageAspect)
        : null,
    [containerSize, pageAspect],
  )

  const containerReady = containerSize.width > 0 && containerSize.height > 0
  const readyToRender = Boolean(pdfUrl && containerReady && renderSize)

  useEffect(() => {
    if (!pdfFile) {
      setPdfUrl(null)
      setPageAspect(null)
      return
    }
    const url = URL.createObjectURL(pdfFile)
    setPdfUrl(url)
    setLoadError(null)
    setPageAspect(null)
    return () => URL.revokeObjectURL(url)
  }, [pdfFile])

  // Load page dimensions before rendering — avoids chicken-and-egg with renderSize
  useEffect(() => {
    if (!pdfUrl) return

    let cancelled = false
    setIsLoadingMeta(true)

    const task = pdfjs.getDocument(pdfUrl)
    task.promise
      .then((doc) => doc.getPage(1))
      .then((page) => {
        if (cancelled) return
        const viewport = page.getViewport({ scale: 1 })
        setPageAspect(viewport.height / viewport.width)
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMeta(false)
      })

    return () => {
      cancelled = true
      void task.destroy()
    }
  }, [pdfUrl])

  useEffect(() => {
    if (renderSize) {
      onPreviewDimensions(renderSize)
    }
  }, [renderSize, onPreviewDimensions])

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    resizeObserverRef.current?.disconnect()
    resizeObserverRef.current = null

    if (!node) {
      setContainerSize({ width: 0, height: 0 })
      return
    }

    const updateSize = () => {
      setContainerSize({ width: node.clientWidth, height: node.clientHeight })
    }

    updateSize()
    const observer = new ResizeObserver(() => updateSize())
    observer.observe(node)
    resizeObserverRef.current = observer
  }, [])

  useEffect(() => {
    return () => resizeObserverRef.current?.disconnect()
  }, [])

  const statusMessage = (() => {
    if (!containerReady) return 'Preparing preview…'
    if (isLoadingMeta || !pageAspect) return 'Loading preview…'
    return 'Preparing preview…'
  })()

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Preview — page 1
        </h3>
        {stampUrl && (
          <p className="text-[10px] text-slate-500">
            Drag to move · corner to resize
          </p>
        )}
      </div>

      {/* absolute inset-0 ensures measurable height in flex layout */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg bg-slate-950/50"
        >
          {!pdfFile ? (
            <p className="text-sm text-slate-500">Upload PDFs to see a preview of page 1</p>
          ) : loadError ? (
            <p className="px-4 text-center text-sm text-red-400">{loadError}</p>
          ) : readyToRender ? (
            <Document
              file={pdfUrl}
              onLoadError={(err) => setLoadError(err.message)}
              loading={<p className="text-sm text-slate-500">Loading preview…</p>}
              className="flex items-center justify-center"
            >
              <div
                className="relative bg-white shadow-lg"
                style={{ width: renderSize!.width, height: renderSize!.height }}
              >
                <Page
                  pageNumber={1}
                  width={renderSize!.width}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                {stampUrl && (
                  <StampOverlay
                    stampUrl={stampUrl}
                    placement={placement}
                    onPlacementChange={onPlacementChange}
                    containerWidth={renderSize!.width}
                    containerHeight={renderSize!.height}
                  />
                )}
              </div>
            </Document>
          ) : (
            <p className="text-sm text-slate-500">{statusMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}

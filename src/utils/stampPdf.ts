import { PDFDocument } from 'pdf-lib'
import type { PageDimensions, PreviewDimensions, StampPlacement } from '../types'

/** Convert preview placement to PDF coordinates (bottom-left origin) */
export function placementToPdfCoords(
  placement: StampPlacement,
  preview: PreviewDimensions,
  page: PageDimensions,
) {
  const scaleX = page.width / preview.width
  const scaleY = page.height / preview.height

  return {
    x: placement.x * scaleX,
    y: page.height - (placement.y + placement.height) * scaleY,
    width: placement.width * scaleX,
    height: placement.height * scaleY,
  }
}

/** Embed stamp image bytes and draw on first page of a PDF */
export async function stampPdfFirstPage(
  pdfBytes: ArrayBuffer,
  stampBytes: ArrayBuffer,
  stampMime: string,
  placement: StampPlacement,
  preview: PreviewDimensions,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  if (pages.length === 0) {
    throw new Error('PDF has no pages')
  }

  const firstPage = pages[0]
  const pageSize = {
    width: firstPage.getWidth(),
    height: firstPage.getHeight(),
  }

  const coords = placementToPdfCoords(placement, preview, pageSize)

  const isPng = stampMime === 'image/png' || stampMime.endsWith('png')
  const stampImage = isPng
    ? await pdfDoc.embedPng(stampBytes)
    : await pdfDoc.embedJpg(stampBytes)

  firstPage.drawImage(stampImage, {
    x: coords.x,
    y: coords.y,
    width: coords.width,
    height: coords.height,
  })

  return pdfDoc.save()
}

/** Read a File as ArrayBuffer */
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer()
}

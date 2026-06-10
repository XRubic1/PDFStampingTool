/** A PDF file queued for stamping */
export interface PdfFileItem {
  id: string
  file: File
  name: string
}

/** Stamp position/size in preview pixel coordinates (top-left origin) */
export interface StampPlacement {
  x: number
  y: number
  width: number
  height: number
}

/** Dimensions of the rendered PDF preview */
export interface PreviewDimensions {
  width: number
  height: number
}

/** Actual PDF page dimensions in points */
export interface PageDimensions {
  width: number
  height: number
}

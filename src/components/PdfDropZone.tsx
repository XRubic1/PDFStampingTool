import { useCallback, useState } from 'react'

interface PdfDropZoneProps {
  onFilesAdded: (files: File[]) => void
  disabled?: boolean
  compact?: boolean
}

/** Drag-and-drop zone for uploading PDF files */
export function PdfDropZone({ onFilesAdded, disabled, compact }: PdfDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const dropped = Array.from(e.dataTransfer.files)
      onFilesAdded(dropped)
    },
    [disabled, onFilesAdded],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      onFilesAdded(Array.from(e.target.files))
      e.target.value = ''
    },
    [onFilesAdded],
  )

  if (compact) {
    return (
      <label
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={[
          'relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-xs font-medium transition-all duration-200',
          isDragging
            ? 'border-sky-400 bg-sky-500/10 text-sky-300'
            : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300',
          disabled ? 'pointer-events-none opacity-50' : '',
        ].join(' ')}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          multiple
          disabled={disabled}
          onChange={handleFileInput}
          className="sr-only"
          aria-label="Add more PDF files"
        />
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add more PDFs
      </label>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        'relative flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 transition-all duration-200',
        isDragging
          ? 'border-sky-400 bg-sky-500/10 scale-[1.01]'
          : 'border-slate-600 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900',
        disabled ? 'pointer-events-none opacity-50' : '',
      ].join(' ')}
    >
      <input
        type="file"
        accept="application/pdf,.pdf"
        multiple
        disabled={disabled}
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Upload PDF files"
      />
      <svg
        className="mb-2 h-8 w-8 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-center text-sm font-medium text-slate-200">
        Drag & drop PDF files here
      </p>
      <p className="mt-0.5 text-center text-xs text-slate-500">or click to browse</p>
    </div>
  )
}
